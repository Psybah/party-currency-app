export async function fetchStates() {
  const response = await fetch('https://nga-states-lga.onrender.com/fetch');
  if (!response.ok) {
    throw new Error('Failed to fetch states');
  }
  const data = await response.json();
  return data.states;
}

export async function fetchLGAs(state) {
  const response = await fetch(`https://nga-states-lga.onrender.com/?state=${state}`);
  if (!response.ok) {
    throw new Error('Failed to fetch LGAs');
  }
  const data = await response.json();
  return data.lga;
}