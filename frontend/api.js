export async function fetchData(endpoint) {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`Failed to fetch data: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
