import { VIDEOS } from '@/lib/constants/videos';
import { getSupabaseClient } from '@/lib/supabase/client';

export type SessionRecord = {
  id: string;
  videoId: string;
  title: string;
  intention: string;
  focusMinutes: number;
  distractions: number;
  questions: number;
  completedAt: string;
};

export type ChatMessage = { question: string; answer: string };

type SessionRow = {
  id: string;
  lesson_id: string;
  intention: string | null;
  focused_seconds: number;
  distractions_count: number;
  questions_count: number;
  completed_at: string | null;
};

function toSessionRecord(row: SessionRow): SessionRecord {
  const video = VIDEOS.find((item) => item.id === row.lesson_id);
  return {
    id: row.id,
    videoId: row.lesson_id,
    title: video?.title ?? row.lesson_id,
    intention: row.intention ?? '',
    focusMinutes: Math.floor(row.focused_seconds / 60),
    distractions: row.distractions_count,
    questions: row.questions_count,
    completedAt: row.completed_at ?? new Date().toISOString(),
  };
}

export async function getCompletedSessions(userId: string) {
  const { data, error } = await getSupabaseClient()
    .from('learning_sessions')
    .select('id, lesson_id, intention, focused_seconds, distractions_count, questions_count, completed_at')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false });

  if (error) throw error;
  return (data as SessionRow[]).map(toSessionRecord);
}

export async function getCompletedSession(userId: string, sessionId: string) {
  const { data, error } = await getSupabaseClient()
    .from('learning_sessions')
    .select('id, lesson_id, intention, focused_seconds, distractions_count, questions_count, completed_at')
    .eq('user_id', userId)
    .eq('id', sessionId)
    .eq('status', 'completed')
    .maybeSingle();

  if (error) throw error;
  return data ? toSessionRecord(data as SessionRow) : null;
}

export async function saveCompletedSession(
  userId: string,
  record: Omit<SessionRecord, 'title'>,
  plannedMinutes: number,
  focusedSeconds: number,
  messages: ChatMessage[],
) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('learning_sessions')
    .insert({
      id: record.id,
      user_id: userId,
      lesson_id: record.videoId,
      intention: record.intention,
      planned_minutes: plannedMinutes,
      focused_seconds: focusedSeconds,
      distractions_count: record.distractions,
      questions_count: record.questions,
      status: 'completed',
      completed_at: record.completedAt,
    })
    .select('id')
    .single();

  if (error) throw error;

  if (messages.length) {
    const rows = messages.flatMap((message) => [
      { session_id: data.id, role: 'user' as const, content: message.question },
      { session_id: data.id, role: 'assistant' as const, content: message.answer },
    ]);
    const { error: messageError } = await supabase.from('session_messages').insert(rows);
    if (messageError) {
      const { error: cleanupError } = await supabase
        .from('learning_sessions')
        .delete()
        .eq('id', data.id)
        .eq('user_id', userId);
      if (cleanupError) {
        throw new Error(`Could not save session messages (${messageError.message}); cleanup also failed (${cleanupError.message}).`);
      }
      throw messageError;
    }
  }
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
}
