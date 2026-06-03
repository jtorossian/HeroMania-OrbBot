// youtube.js
import axios from 'axios';
import { EmbedBuilder } from 'discord.js';

const POLL_INTERVAL = 60 * 60 * 1000; // 1 hour in ms
let lastVideoId = null;

async function fetchLatestVideo() {
  const { data } = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      key: process.env.YOUTUBE_API_KEY,
      channelId: process.env.YOUTUBE_CHANNEL_ID,
      part: 'snippet',
      order: 'date',
      maxResults: 1,
      type: 'video',
    },
  });
  return data.items[0] ?? null;
}

export async function startYouTubePoller(client) {
  // Seed lastVideoId on startup so we don't post old videos on boot
  const seed = await fetchLatestVideo();
  if (seed) lastVideoId = seed.id.videoId;
  console.log(`YouTube poller started. Seed video: ${lastVideoId}`);

  setInterval(async () => {
    try {
      const video = await fetchLatestVideo();
      if (!video || video.id.videoId === lastVideoId) return;

      lastVideoId = video.id.videoId;
      const { title, channelTitle, thumbnails } = video.snippet;
      const url = `https://youtube.com/watch?v=${lastVideoId}`;

      const channel = client.channels.cache.get(process.env.YOUTUBE_NOTIFY_CHANNEL_ID);
      if (!channel) return;

      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle(title)
        .setURL(url)
        .setAuthor({ name: channelTitle })
        .setImage(thumbnails.high.url)
        .setDescription('O.R.B Reporting in that a new video just dropped 🎬')
        .setTimestamp();

      const msg = await channel.send({ content: '@everyone', embeds: [embed] });
      await msg.crosspost();
    } catch (err) {
      console.error('YouTube poll error:', err.message);
    }
  }, POLL_INTERVAL);
}