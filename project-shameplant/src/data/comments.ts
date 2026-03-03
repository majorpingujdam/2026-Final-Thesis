import { Comment } from '../types'

/**
 * Comment database for Project Shameplant.
 * 110+ comments spanning positive, neutral, negative, and severe cyberbullying content.
 * Languages: Simplified Chinese (zh) and English (en).
 *
 * NOTE: Negative/severe comments reflect real cyberbullying language
 * included for educational and artistic purposes.
 */
export const COMMENTS: Comment[] = [

  // ── POSITIVE · Chinese ─────────────────────────────────────────────────────
  { id: 'pzh01', text: '你真的很棒！', category: 'positive', severity: 8, language: 'zh' },
  { id: 'pzh02', text: '加油！你能做到的！', category: 'positive', severity: 7, language: 'zh' },
  { id: 'pzh03', text: '你是最好的！', category: 'positive', severity: 9, language: 'zh' },
  { id: 'pzh04', text: '好厉害！继续努力！', category: 'positive', severity: 7, language: 'zh' },
  { id: 'pzh05', text: '你很有才华！', category: 'positive', severity: 8, language: 'zh' },
  { id: 'pzh06', text: '我一直都支持你！', category: 'positive', severity: 6, language: 'zh' },
  { id: 'pzh07', text: '你让我们都很骄傲！', category: 'positive', severity: 9, language: 'zh' },
  { id: 'pzh08', text: '你的笑容很美丽！', category: 'positive', severity: 7, language: 'zh' },
  { id: 'pzh09', text: '相信自己，你可以的！', category: 'positive', severity: 8, language: 'zh' },
  { id: 'pzh10', text: '你真的很勇敢！', category: 'positive', severity: 8, language: 'zh' },
  { id: 'pzh11', text: '你的努力大家都看到了！', category: 'positive', severity: 7, language: 'zh' },
  { id: 'pzh12', text: '你是一个很棒的人！', category: 'positive', severity: 8, language: 'zh' },
  { id: 'pzh13', text: '你的创意太赞了！', category: 'positive', severity: 8, language: 'zh' },
  { id: 'pzh14', text: '我喜欢你的风格！', category: 'positive', severity: 6, language: 'zh' },
  { id: 'pzh15', text: '你总是给人带来正能量！', category: 'positive', severity: 7, language: 'zh' },
  { id: 'pzh16', text: '世界因为有你而更精彩！', category: 'positive', severity: 10, language: 'zh' },
  { id: 'pzh17', text: '你的善良是最大的财富！', category: 'positive', severity: 9, language: 'zh' },
  { id: 'pzh18', text: '你每天都在进步！', category: 'positive', severity: 7, language: 'zh' },
  { id: 'pzh19', text: '你的存在很有意义！', category: 'positive', severity: 10, language: 'zh' },
  { id: 'pzh20', text: '你是独一无二的！', category: 'positive', severity: 9, language: 'zh' },

  // ── POSITIVE · English ─────────────────────────────────────────────────────
  { id: 'pen01', text: 'You are amazing!', category: 'positive', severity: 8, language: 'en' },
  { id: 'pen02', text: "Keep it up! You're doing great!", category: 'positive', severity: 7, language: 'en' },
  { id: 'pen03', text: 'You inspire me every day!', category: 'positive', severity: 9, language: 'en' },
  { id: 'pen04', text: 'You are so talented!', category: 'positive', severity: 8, language: 'en' },
  { id: 'pen05', text: 'I believe in you!', category: 'positive', severity: 7, language: 'en' },
  { id: 'pen06', text: "You're doing an incredible job!", category: 'positive', severity: 9, language: 'en' },
  { id: 'pen07', text: 'Your hard work really shows!', category: 'positive', severity: 7, language: 'en' },
  { id: 'pen08', text: 'You make the world a better place!', category: 'positive', severity: 10, language: 'en' },
  { id: 'pen09', text: 'You are stronger than you know!', category: 'positive', severity: 8, language: 'en' },
  { id: 'pen10', text: "So proud of everything you've done!", category: 'positive', severity: 9, language: 'en' },
  { id: 'pen11', text: 'Your kindness matters so much!', category: 'positive', severity: 8, language: 'en' },
  { id: 'pen12', text: 'You are loved and valued!', category: 'positive', severity: 10, language: 'en' },
  { id: 'pen13', text: 'Never stop being you!', category: 'positive', severity: 8, language: 'en' },
  { id: 'pen14', text: "The world is lucky to have you!", category: 'positive', severity: 9, language: 'en' },
  { id: 'pen15', text: "You've got this!", category: 'positive', severity: 6, language: 'en' },

  // ── NEUTRAL · Chinese ──────────────────────────────────────────────────────
  { id: 'nzh01', text: '这很有趣', category: 'neutral', severity: 1, language: 'zh' },
  { id: 'nzh02', text: '还不错吧', category: 'neutral', severity: 1, language: 'zh' },
  { id: 'nzh03', text: '一般般', category: 'neutral', severity: 0, language: 'zh' },
  { id: 'nzh04', text: '看看再说', category: 'neutral', severity: 0, language: 'zh' },
  { id: 'nzh05', text: '还行', category: 'neutral', severity: 1, language: 'zh' },
  { id: 'nzh06', text: '不知道耶', category: 'neutral', severity: 0, language: 'zh' },

  // ── NEUTRAL · English ──────────────────────────────────────────────────────
  { id: 'nen01', text: "That's interesting...", category: 'neutral', severity: 0, language: 'en' },
  { id: 'nen02', text: "I'm not sure about this", category: 'neutral', severity: -1, language: 'en' },
  { id: 'nen03', text: 'OK I guess', category: 'neutral', severity: 0, language: 'en' },
  { id: 'nen04', text: 'Hmm, could go either way', category: 'neutral', severity: 0, language: 'en' },

  // ── NEGATIVE · Chinese ─────────────────────────────────────────────────────
  { id: 'bzh01', text: '你太敏感了', category: 'negative', severity: -5, language: 'zh' },
  { id: 'bzh02', text: '没人在乎你', category: 'negative', severity: -7, language: 'zh' },
  { id: 'bzh03', text: '你怎么这么自以为是', category: 'negative', severity: -6, language: 'zh' },
  { id: 'bzh04', text: '你真的很烦', category: 'negative', severity: -6, language: 'zh' },
  { id: 'bzh05', text: '你就是个失败者', category: 'negative', severity: -8, language: 'zh' },
  { id: 'bzh06', text: '别出来丢人了', category: 'negative', severity: -7, language: 'zh' },
  { id: 'bzh07', text: '你的想法很幼稚', category: 'negative', severity: -5, language: 'zh' },
  { id: 'bzh08', text: '有你这样的人真是社会的耻辱', category: 'negative', severity: -9, language: 'zh' },
  { id: 'bzh09', text: '你怎么这么蠢', category: 'negative', severity: -7, language: 'zh' },
  { id: 'bzh10', text: '你根本不值得被爱', category: 'negative', severity: -9, language: 'zh' },
  { id: 'bzh11', text: '你有什么资格说话', category: 'negative', severity: -6, language: 'zh' },
  { id: 'bzh12', text: '真是够了，你能不能消失', category: 'negative', severity: -8, language: 'zh' },
  { id: 'bzh13', text: '你永远都不会成功', category: 'negative', severity: -8, language: 'zh' },
  { id: 'bzh14', text: '没有人喜欢你', category: 'negative', severity: -7, language: 'zh' },
  { id: 'bzh15', text: '你真的很丑', category: 'negative', severity: -7, language: 'zh' },
  { id: 'bzh16', text: '你这辈子就这样了', category: 'negative', severity: -8, language: 'zh' },
  { id: 'bzh17', text: '你让周围所有人都很烦', category: 'negative', severity: -7, language: 'zh' },
  { id: 'bzh18', text: '你的存在是个错误', category: 'negative', severity: -9, language: 'zh' },
  { id: 'bzh19', text: '没有你世界会更好', category: 'negative', severity: -9, language: 'zh' },
  { id: 'bzh20', text: '你配不上任何好东西', category: 'negative', severity: -8, language: 'zh' },

  // ── NEGATIVE · English ─────────────────────────────────────────────────────
  { id: 'ben01', text: "You're too sensitive", category: 'negative', severity: -5, language: 'en' },
  { id: 'ben02', text: 'No one cares about you', category: 'negative', severity: -7, language: 'en' },
  { id: 'ben03', text: "You're so annoying", category: 'negative', severity: -6, language: 'en' },
  { id: 'ben04', text: "You're a complete failure", category: 'negative', severity: -8, language: 'en' },
  { id: 'ben05', text: "You're so pathetic", category: 'negative', severity: -7, language: 'en' },
  { id: 'ben06', text: 'Nobody wants you here', category: 'negative', severity: -7, language: 'en' },
  { id: 'ben07', text: 'You will never succeed', category: 'negative', severity: -8, language: 'en' },
  { id: 'ben08', text: "You're worthless", category: 'negative', severity: -9, language: 'en' },
  { id: 'ben09', text: 'Just give up already', category: 'negative', severity: -7, language: 'en' },
  { id: 'ben10', text: "You don't deserve to be here", category: 'negative', severity: -8, language: 'en' },
  { id: 'ben11', text: 'Nobody likes you', category: 'negative', severity: -7, language: 'en' },
  { id: 'ben12', text: "You're a waste of time", category: 'negative', severity: -7, language: 'en' },
  { id: 'ben13', text: 'Everyone is laughing at you', category: 'negative', severity: -8, language: 'en' },
  { id: 'ben14', text: "You're such a loser", category: 'negative', severity: -7, language: 'en' },
  { id: 'ben15', text: 'Your life is a mistake', category: 'negative', severity: -9, language: 'en' },

  // ── SEVERE · Chinese ───────────────────────────────────────────────────────
  { id: 'szh01', text: '去死吧', category: 'severe', severity: -10, language: 'zh' },
  { id: 'szh02', text: '你活着有什么意义', category: 'severe', severity: -10, language: 'zh' },
  { id: 'szh03', text: '世界少了你会更好', category: 'severe', severity: -10, language: 'zh' },
  { id: 'szh04', text: '你这个废物', category: 'severe', severity: -9, language: 'zh' },
  { id: 'szh05', text: '你的家人为你感到羞耻', category: 'severe', severity: -10, language: 'zh' },
  { id: 'szh06', text: '没有人会想念你', category: 'severe', severity: -10, language: 'zh' },
  { id: 'szh07', text: '你不应该出生', category: 'severe', severity: -10, language: 'zh' },
  { id: 'szh08', text: '你是人渣', category: 'severe', severity: -9, language: 'zh' },
  { id: 'szh09', text: '你毁了所有人的生活', category: 'severe', severity: -9, language: 'zh' },
  { id: 'szh10', text: '你永远不配被爱', category: 'severe', severity: -10, language: 'zh' },

  // ── SEVERE · English ───────────────────────────────────────────────────────
  { id: 'sen01', text: 'The world is better without you', category: 'severe', severity: -10, language: 'en' },
  { id: 'sen02', text: 'You should just disappear', category: 'severe', severity: -10, language: 'en' },
  { id: 'sen03', text: 'Nobody would miss you', category: 'severe', severity: -10, language: 'en' },
  { id: 'sen04', text: 'You are an absolute waste of space', category: 'severe', severity: -9, language: 'en' },
  { id: 'sen05', text: 'Everyone hates you', category: 'severe', severity: -9, language: 'en' },
  { id: 'sen06', text: 'You were a mistake', category: 'severe', severity: -10, language: 'en' },
  { id: 'sen07', text: 'Do the world a favor and leave', category: 'severe', severity: -10, language: 'en' },
  { id: 'sen08', text: 'You deserve every bad thing that happens to you', category: 'severe', severity: -9, language: 'en' },
  { id: 'sen09', text: "No one has ever cared about you", category: 'severe', severity: -10, language: 'en' },
  { id: 'sen10', text: "You'll never be loved", category: 'severe', severity: -10, language: 'en' },
]

// Weighted shuffle – more positive comments near start; ramps up negativity
export function getShuffledComments(): Comment[] {
  const positive = COMMENTS.filter(c => c.category === 'positive' || c.category === 'neutral')
  const negative = COMMENTS.filter(c => c.category === 'negative')
  const severe   = COMMENTS.filter(c => c.category === 'severe')

  const shuffled: Comment[] = []

  // Interleave: 2 positive → 1 negative, gradually introduce severe
  let pi = 0, ni = 0, si = 0
  while (pi < positive.length || ni < negative.length || si < severe.length) {
    if (pi < positive.length) shuffled.push(positive[pi++])
    if (pi < positive.length) shuffled.push(positive[pi++])
    if (ni < negative.length) shuffled.push(negative[ni++])
    if (si < severe.length && shuffled.length > 30) shuffled.push(severe[si++])
  }
  return shuffled
}

export function randomComment(pool: Comment[]): Comment {
  return pool[Math.floor(Math.random() * pool.length)]
}
