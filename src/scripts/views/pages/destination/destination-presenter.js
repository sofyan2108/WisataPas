import CONFIG from "../../../globals/config";

class DestinationPresenter {
  constructor(view) {
    this._view = view;
    this._categories = [
      "Semua",
      "Pantai",
      "Gunung",
      "Sejarah",
      "Budaya",
      "Alam",
    ];
    this._locations = [
      "Semua",
      "Bali",
      "Jawa Timur",
      "Jawa Tengah",
      "Papua Barat",
      "Sumatera",
    ];
    this._currentPage = 1;
    this._itemsPerPage = 9;
    this._filters = {
      category: "Semua",
      location: "Semua",
      rating: 0,
      priceRange: "Semua",
    };
    this._destinations = [];
  }

  async init() {
    const username = localStorage.getItem("username") || "user11";

    try {
      const response = await fetch(CONFIG.RECOMENDATION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }), // dikirim ke Hapi.js
      });

      const data = await response.json();

      if (data.status === "success") {
        // console.log(data.recommendations[0].item);
        this._destinations = data.recommendations.map((item, index) => ({
          id: index,
          title: item.item,
          description: item.deskripsi,
          image: item.lokasi,
          location: "Indonesia",
          category: "Umum",
          rating: item.rating,
          price: item.harga,
          facilities: ["WiFi", "Toilet", "Parkir"],
        }));
      } else {
        console.warn("Tidak ada data rekomendasi:", data.message);
      }

      await this._view.updateContent({
        destinations: this._getFilteredDestinations(),
        categories: this._categories,
        locations: this._locations,
        currentPage: this._currentPage,
        totalPages: this._getTotalPages(),
        filters: this._filters,
      });
    } catch (error) {
      console.error("Gagal mengambil data rekomendasi:", error);
    }
  }

  _getFilteredDestinations() {
    let filtered = [...this._destinations];

    // Apply filters
    if (this._filters.category !== "Semua") {
      filtered = filtered.filter(
        (dest) => dest.category === this._filters.category
      );
    }
    if (this._filters.location !== "Semua") {
      filtered = filtered.filter(
        (dest) => dest.location === this._filters.location
      );
    }
    if (this._filters.rating > 0) {
      filtered = filtered.filter((dest) => dest.rating >= this._filters.rating);
    }
    if (this._filters.priceRange !== "Semua") {
      // Implementasi filter harga
    }

    // Apply pagination
    const start = (this._currentPage - 1) * this._itemsPerPage;
    const end = start + this._itemsPerPage;
    return filtered.slice(start, end);
  }

  _getTotalPages() {
    const filteredCount = this._getFilteredDestinations().length;
    return Math.ceil(filteredCount / this._itemsPerPage);
  }
  // Test
  getDestinationByTitle(title) {
    return this._destinations.find((d) => d.title === title);
  }
  //
  handleFilterChange(filters) {
    this._filters = { ...this._filters, ...filters };
    this._currentPage = 1; // Reset to first page when filters change
    this.init();
  }

  handlePageChange(page) {
    this._currentPage = page;
    this.init();
  }

  handleSearch(query) {
    if (query) {
      const searchResults = this._destinations.filter(
        (dest) =>
          dest.title.toLowerCase().includes(query.toLowerCase()) ||
          dest.description.toLowerCase().includes(query.toLowerCase()) ||
          dest.location.toLowerCase().includes(query.toLowerCase())
      );
      this._destinations = searchResults;
    }
    this._currentPage = 1;
    this.init();
  }
}

export default DestinationPresenter;
