export async function fetchAnimes(type) {
    try {
      let url;
  
      if (type === "week") {
        url = "https://api.jikan.moe/v4/top/anime?filter=airing";
      } else if (type === "year") {
        url = `https://api.jikan.moe/v4/seasons/2024/spring`;
      } else {
        url = "https://api.jikan.moe/v4/top/anime";
      }
  
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (!data.data) {
        throw new Error("Nenhum dado encontrado na API");
      }
  
      const sortedAnimes = data.data.sort((a, b) => b.score - a.score);
  
      return sortedAnimes.slice(0, 10);
    } catch (error) {
      console.error("Erro ao buscar animes:", error);
      return [];
    }
  }
  