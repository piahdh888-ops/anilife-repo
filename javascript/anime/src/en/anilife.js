const BASE_URL = "https://anilife01.tv";

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }
  return await response.json();
}

async function getPopular(page = 1) {
  const data = await fetchJson(
    `${BASE_URL}/api/anime?page=${page}&v=catalog-media-2`
  );

  const items = Array.isArray(data)
    ? data
    : data.items || data.results || data.data || [];

  return {
    list: items.map((item) => ({
      name: item.title || item.name || item.title_ko || "",
      url: String(item.id ?? item.slug ?? ""),
      link: `${BASE_URL}/anime/${item.id ?? item.slug ?? ""}`,
    })),
    hasNextPage: Boolean(data.nextPage || data.hasNextPage),
  };
}

async function search(query, page = 1) {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    v: "catalog-media-2",
  });

  const data = await fetchJson(`${BASE_URL}/api/anime?${params}`);
  const items = Array.isArray(data)
    ? data
    : data.items || data.results || data.data || [];

  return {
    list: items.map((item) => ({
      name: item.title || item.name || item.title_ko || "",
      url: String(item.id ?? item.slug ?? ""),
      link: `${BASE_URL}/anime/${item.id ?? item.slug ?? ""}`,
    })),
    hasNextPage: Boolean(data.nextPage || data.hasNextPage),
  };
}

async function getDetail(id) {
  const data = await fetchJson(
    `${BASE_URL}/api/anime/${encodeURIComponent(id)}?v=playback-url-v1`
  );

  const item = data.anime || data.item || data.data || data;

  return {
    name: item.title || item.name || "",
    image: item.poster || item.image || item.cover || "",
    description: item.description || item.synopsis || "",
    chapters: (item.episodes || item.chapters || []).map((ep) => ({
      name: ep.title || ep.name || `Episode ${ep.number || ep.id}`,
      url: String(ep.id ?? ep.url ?? ""),
    })),
  };
}

async function getVideoList(episodeId) {
  const data = await fetchJson(
    `${BASE_URL}/api/anime/${encodeURIComponent(episodeId)}?v=playback-url-v1`
  );

  const video = data.video || data.source || data.data || data;

  return [{
    url: video.url || video.playbackUrl || video.src || "",
    originalUrl: video.url || video.playbackUrl || video.src || "",
    quality: video.quality || "Auto",
  }];
}
