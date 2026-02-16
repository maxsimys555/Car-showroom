const API_BASE = "https://dummyjson.com";

export async function fetchVehicles() {
  const response = await fetch(`${API_BASE}/products/category/vehicle?limit=100`);
  if (!response.ok) {
    throw new Error("Failed to load vehicles.");
  }
  const data = await response.json();
  return data.products || [];
}

export async function fetchVehicleById(vehicleId) {
  const response = await fetch(`${API_BASE}/products/${vehicleId}`);
  if (!response.ok) {
    throw new Error("Failed to load vehicle.");
  }
  return response.json();
}
