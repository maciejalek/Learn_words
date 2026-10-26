export function findTopic(topics,input){const code=String(input??'').trim();if(!/^\d{1,8}$/.test(code))return null;return topics.find(topic=>topic.code===String(Number(code)))||null;}
export function topicWords(topic){return topic.entries.filter(e=>e.kind==='word');}
export function topicSentences(topic){return topic.entries.filter(e=>e.kind==='sentence');}
export function lessonSessionMatches(session,code){return (session.lessonCode||'')===(code||'');}
