'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { VideoTile } from '@/components/dashboard/VideoTile';
import { Icon } from '@/components/ui/Icon';
import { INTERESTS } from '@/lib/constants';
import { VIDEOS } from '@/lib/constants/videos';
import type { Video } from '@/lib/types';
import type { IconName } from '@/components/ui/Icon';
import { getSupabaseClient } from '@/lib/supabase/client';
import { getCompletedSessions, getErrorMessage, type SessionRecord } from '@/lib/supabase/learning';

function localDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDuration(minutes: number) {
  if (minutes === 0) return '<1m';
  if (minutes < 60) return `${minutes}m`;
  const hours = minutes / 60;
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)}h`;
}

function InterestIcon({ interest }: { interest: string }) {
  const icon: IconName = interest === 'Artificial Intelligence' ? 'brain'
    : interest === 'Salesforce' ? 'cloud'
      : interest === 'Python' ? 'code'
        : interest === 'Cloud Computing' ? 'cloud'
          : interest === 'Data Science' ? 'chart'
            : 'sparkle';
  return <Icon name={icon} size={15} />;
}

export default function DashboardPage() {
  const [name, setName] = useState('Learner');
  const [interests, setInterests] = useState<string[]>([]);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const supabase = getSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) return;

        const [{ data: profile, error: profileError }, { data: selections, error: selectionsError }, { data: topics, error: topicsError }, loadedSessions] = await Promise.all([
          supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle(),
          supabase.from('user_topics').select('topic_id').eq('user_id', user.id),
          supabase.from('topics').select('id, name'),
          getCompletedSessions(user.id),
        ]);
        if (profileError) throw profileError;
        if (selectionsError) throw selectionsError;
        if (topicsError) throw topicsError;

        const fullName = profile?.full_name || user.user_metadata.full_name || user.email?.split('@')[0] || 'Learner';
        const topicNames = new Map((topics ?? []).map((topic) => [topic.id, topic.name]));
        setName(String(fullName).split(' ')[0]);
        setInterests((selections ?? []).flatMap((selection) => {
          const topicName = topicNames.get(selection.topic_id);
          return topicName ? [topicName] : [];
        }));
        setSessions(loadedSessions);
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      }
    }
    void loadDashboard();
  }, []);

  const recommendations = useMemo(() => {
    const preferred = interests.flatMap((interest) => VIDEOS.filter((video) => video.category === interest));
    return [...preferred, ...VIDEOS.filter((video) => !preferred.some((item) => item.id === video.id))];
  }, [interests]);
  const featured: Video = recommendations.find((video) => video.category === 'Salesforce') ?? recommendations[0];
  const firstName = name.charAt(0).toUpperCase() + name.slice(1);
  const totalMinutes = sessions.reduce((total, session) => total + session.focusMinutes, 0);
  const totalQuestions = sessions.reduce((total, session) => total + session.questions, 0);
  const completedDays = new Set(sessions.map((session) => localDateKey(new Date(session.completedAt))));
  const today = new Date();
  const todayKey = localDateKey(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const streakStart = completedDays.has(todayKey) ? today : yesterday;
  const streak = new Date(streakStart);
  let streakDays = 0;
  while (completedDays.has(localDateKey(streak))) {
    streakDays += 1;
    streak.setDate(streak.getDate() - 1);
  }
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - ((today.getDay() + 6) % 7) + index);
    return { date, done: completedDays.has(localDateKey(date)) };
  });
  const interestList = interests.length ? interests : INTERESTS.slice(0, 4);

  return (
    <AppShell>
      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-error">{error}</p>}
      <div className="dashboard-grid">
        <div className="dashboard-main-column">
          <div className="dashboard-heading">
            <div>
              <p className="dashboard-date">{new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(today)}</p>
              <h1>Good to see you, {firstName} <span aria-hidden="true">👋</span></h1>
              <p>Ready to continue your learning journey?</p>
            </div>
          </div>

          <section className="featured-lesson" aria-label="Today's featured lesson">
            <div className="featured-copy">
              <span className="featured-label"><Icon name="play" size={13} fill="currentColor" /> TODAY&apos;S LEARNING</span>
              <h2>{featured.title}</h2>
              <div className="featured-meta">
                <span><Icon name="clock" size={14} /> {featured.duration} min</span>
                <span><Icon name="target" size={14} /> {featured.difficulty}</span>
                <span><Icon name="cloud" size={14} /> {featured.category}</span>
              </div>
              <p className="featured-description">Recommended because you&apos;re interested in {featured.category}.</p>
              <div className="flex flex-wrap gap-2">
                <Link href={`/study/${featured.id}/prepare`} className="featured-start"><Icon name="play" size={15} fill="currentColor" /> Start learning</Link>
                <Link href={`/video/${featured.id}`} aria-label={`View ${featured.title}`} className="featured-bookmark"><Icon name="bookmark" size={18} /></Link>
              </div>
            </div>
            <div className={`featured-art bg-gradient-to-br ${featured.thumbnail ?? 'from-blue-400 to-blue-700'}`}>
              <span className="featured-art-orbit" />
              <span className="featured-cloud"><Icon name="cloud" size={37} /></span>
              <span className="featured-art-play"><Icon name="play" size={20} fill="currentColor" /></span>
              <div className="featured-code-card"><span>LEARN</span><strong>{featured.skill}</strong><Icon name="chart" size={18} /></div>
              <div className="featured-art-caption"><span className="h-2 w-2 rounded-full bg-emerald-300" /> A lesson picked for you</div>
            </div>
          </section>

          <section className="dashboard-section">
            <div className="dashboard-section-heading">
              <div><h2>Recommended for You</h2><p>Based on your interests and learning goals</p></div>
              <Link href="/explore">See all <Icon name="arrow" size={14} /></Link>
            </div>
            <div className="recommendation-grid">
              {recommendations.slice(0, 4).map((video) => <VideoTile key={video.id} video={video} compact />)}
            </div>
          </section>

          <section className="dashboard-section">
            <div className="dashboard-section-heading">
              <div><h2>Browse by Interest</h2><p>Explore more content in your areas of interest</p></div>
              <Link href="/onboarding/interests">Manage <Icon name="arrow" size={14} /></Link>
            </div>
            <div className="interest-browser">
              {INTERESTS.slice(0, 7).map((interest) => (
                <Link key={interest} href={`/explore?topic=${encodeURIComponent(interest)}`} className="interest-card">
                  <span className="interest-icon"><InterestIcon interest={interest} /></span><span>{interest}</span>
                </Link>
              ))}
              <Link href="/explore" aria-label="Explore more interests" className="interest-more"><Icon name="arrow" size={18} /></Link>
            </div>
          </section>
        </div>

        <aside className="dashboard-rail">
          <section className="rail-card progress-card">
            <div className="rail-card-heading"><h2>Your Progress</h2><Link href="/sessions">View all</Link></div>
            <div className="progress-stats">
              <div className="progress-stat stat-mint"><span className="stat-icon"><Icon name="play" size={17} fill="currentColor" /></span><strong>{sessions.length}</strong><span>Sessions<br />completed</span></div>
              <div className="progress-stat stat-pink"><span className="stat-icon"><Icon name="clock" size={17} /></span><strong>{formatDuration(totalMinutes)}</strong><span>Learning<br />time</span></div>
              <div className="progress-stat stat-lilac"><span className="stat-icon"><Icon name="brain" size={17} /></span><strong>{totalQuestions}</strong><span>Questions<br />asked</span></div>
              <div className="progress-stat stat-blue"><span className="stat-icon"><Icon name="chart" size={17} /></span><strong>{streakDays}</strong><span>Day<br />streak</span></div>
            </div>
          </section>

          <section className="rail-card">
            <div className="rail-card-heading"><h2>Your Interests</h2><Link href="/onboarding/interests">Manage</Link></div>
            <div className="interest-chips">
              {interestList.slice(0, 6).map((interest) => <Link key={interest} href={`/explore?topic=${encodeURIComponent(interest)}`}><InterestIcon interest={interest} />{interest}</Link>)}
              {interestList.length > 6 && <span className="interest-overflow">+{interestList.length - 6}</span>}
            </div>
          </section>

          <section className="rail-card streak-card">
            <div className="rail-card-heading"><h2>Learning Streak</h2><span className="streak-count"><Icon name="flame" size={17} /> {streakDays} {streakDays === 1 ? 'Day' : 'Days'}</span></div>
            <p className="streak-subtitle">{streakDays ? 'Nice work! Keep your momentum going.' : 'Start a session today to begin your streak.'}</p>
            <div className="week-strip">
              {week.map(({ date, done }) => <div key={localDateKey(date)} className="week-day"><span className={done ? 'week-check done' : 'week-check'}>{done && <Icon name="check" size={13} />}</span><span>{new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date)}</span></div>)}
            </div>
          </section>

          <section className="rail-card recent-card">
            <div className="rail-card-heading"><h2>Recent Sessions</h2><Link href="/sessions">See all <Icon name="arrow" size={13} /></Link></div>
            {sessions.length ? <div className="recent-list">{sessions.slice(0, 4).map((session) => {
              const video = VIDEOS.find((item) => item.id === session.videoId);
              return <Link key={session.id} href={`/session-report/${session.id}`} className="recent-session">
                <span className={`recent-thumb bg-gradient-to-br ${video?.thumbnail ?? 'from-blue-400 to-blue-700'}`}><Icon name="play" size={13} fill="currentColor" /></span>
                <span className="recent-session-copy"><strong>{session.title}</strong><span>{session.focusMinutes} min · {session.questions} questions</span></span>
                <span className="recent-session-date">{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(session.completedAt))}</span>
              </Link>;
            })}</div> : <div className="recent-empty"><span className="recent-empty-icon"><Icon name="book" size={18} /></span><p>No sessions just yet.</p><span>Finish a lesson and your learning history will appear here.</span><Link href="/explore">Explore lessons <Icon name="arrow" size={13} /></Link></div>}
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
