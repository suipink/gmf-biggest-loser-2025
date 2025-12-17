import { CompetitorEntry, WeighIn } from '../utils/logic';

const STORAGE_KEYS = {
  COMPETITORS: 'gmf_competitors',
  IMAGES: 'gmf_images'
};

export class LocalStorageService {
  // Get all competitors from localStorage
  static getAllCompetitors(): CompetitorEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMPETITORS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  }

  // Save all competitors to localStorage
  static saveAllCompetitors(competitors: CompetitorEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPETITORS, JSON.stringify(competitors));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to save data. Storage might be full.');
    }
  }

  // Add a new competitor
  static addCompetitor(competitor: CompetitorEntry): void {
    const competitors = this.getAllCompetitors();
    competitors.push(competitor);
    this.saveAllCompetitors(competitors);
  }

  // Add weigh-in for a competitor
  static addWeighIn(competitorName: string, date: string, weight: number): void {
    const competitors = this.getAllCompetitors();
    const updatedCompetitors = competitors.map(competitor => {
      if (competitor.name === competitorName) {
        const newWeighIns = [...competitor.weighIns, { date, weight }];
        const sortedWeighIns = newWeighIns.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const latestWeight = sortedWeighIns[sortedWeighIns.length - 1].weight;

        return {
          ...competitor,
          weighIns: sortedWeighIns,
          currentWeight: latestWeight
        };
      }
      return competitor;
    });

    this.saveAllCompetitors(updatedCompetitors);
  }

  // Compress and store image as base64 (optimized for localStorage)
  static async storeProfileImage(competitorName: string, file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      // Create canvas for image compression
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Set canvas size to a reasonable dimension (max 400x400)
        const maxSize = 400;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx!.drawImage(img, 0, 0, width, height);

        // Convert to base64 with compression (0.7 quality for JPEG)
        const base64 = canvas.toDataURL('image/jpeg', 0.7);

        try {
          // Clear storage if needed before storing new image
          this.clearOldImagesIfNeeded();

          // Store the image
          const images = this.getStoredImages();
          images[competitorName] = base64;
          localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images));

          // Update competitor's profile picture
          const competitors = this.getAllCompetitors();
          const updatedCompetitors = competitors.map(competitor => {
            if (competitor.name === competitorName) {
              return { ...competitor, profilePic: base64 };
            }
            return competitor;
          });
          this.saveAllCompetitors(updatedCompetitors);

          resolve(base64);
        } catch (error) {
          reject(new Error(`Storage quota exceeded. Please clear some data or use a smaller image.`));
        }
      };

      img.onerror = () => reject(new Error('Failed to load image file'));

      // Load image from file
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  // Get stored images
  static getStoredImages(): Record<string, string> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.IMAGES);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  // Export data to JSON file
  static exportData(): string {
    const data = {
      competitors: this.getAllCompetitors(),
      images: this.getStoredImages(),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  // Import data from JSON
  static importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      if (data.competitors) {
        this.saveAllCompetitors(data.competitors);
      }
      if (data.images) {
        localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(data.images));
      }
    } catch (error) {
      throw new Error('Invalid data format');
    }
  }

  // Update competitor details (name, cheerer)
  static updateCompetitor(oldName: string, updates: { name?: string; cheerer?: string }): void {
    const competitors = this.getAllCompetitors();
    const updatedCompetitors = competitors.map(competitor => {
      if (competitor.name === oldName) {
        return {
          ...competitor,
          name: updates.name || competitor.name,
          cheerer: updates.cheerer || competitor.cheerer
        };
      }
      return competitor;
    });
    this.saveAllCompetitors(updatedCompetitors);

    // If name changed, update stored images
    if (updates.name && updates.name !== oldName) {
      const images = this.getStoredImages();
      if (images[oldName]) {
        images[updates.name] = images[oldName];
        delete images[oldName];
        localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images));
      }
    }
  }

  // Update a specific weigh-in
  static updateWeighIn(competitorName: string, oldDate: string, newDate: string, newWeight: number): void {
    const competitors = this.getAllCompetitors();
    const updatedCompetitors = competitors.map(competitor => {
      if (competitor.name === competitorName) {
        const updatedWeighIns = competitor.weighIns.map(weighIn => {
          if (weighIn.date === oldDate) {
            return { date: newDate, weight: newWeight };
          }
          return weighIn;
        });

        // Sort by date and update current weight to latest
        const sortedWeighIns = updatedWeighIns.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const latestWeight = sortedWeighIns[sortedWeighIns.length - 1].weight;

        return {
          ...competitor,
          weighIns: sortedWeighIns,
          currentWeight: latestWeight
        };
      }
      return competitor;
    });

    this.saveAllCompetitors(updatedCompetitors);
  }

  // Delete a specific weigh-in
  static deleteWeighIn(competitorName: string, date: string, weight?: number): void {
    const competitors = this.getAllCompetitors();
    const updatedCompetitors = competitors.map(competitor => {
      if (competitor.name === competitorName) {
        let updatedWeighIns;

        if (weight !== undefined) {
          // If weight is provided, delete the specific entry with matching date AND weight
          let deleted = false;
          updatedWeighIns = competitor.weighIns.filter(weighIn => {
            if (!deleted && weighIn.date === date && weighIn.weight === weight) {
              deleted = true;
              return false; // Delete this specific entry
            }
            return true; // Keep all other entries
          });
        } else {
          // Fallback: delete only the first entry with matching date
          let deleted = false;
          updatedWeighIns = competitor.weighIns.filter(weighIn => {
            if (!deleted && weighIn.date === date) {
              deleted = true;
              return false; // Delete only the first match
            }
            return true; // Keep all other entries
          });
        }

        // Sort by date and update current weight to latest
        const sortedWeighIns = updatedWeighIns.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const latestWeight = sortedWeighIns.length > 0 ? sortedWeighIns[sortedWeighIns.length - 1].weight : competitor.baselineWeight;

        return {
          ...competitor,
          weighIns: sortedWeighIns,
          currentWeight: latestWeight
        };
      }
      return competitor;
    });

    this.saveAllCompetitors(updatedCompetitors);
  }

  // Delete a competitor
  static deleteCompetitor(competitorName: string): void {
    const competitors = this.getAllCompetitors();
    const updatedCompetitors = competitors.filter(c => c.name !== competitorName);
    this.saveAllCompetitors(updatedCompetitors);

    // Remove stored image
    const images = this.getStoredImages();
    if (images[competitorName]) {
      delete images[competitorName];
      localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images));
    }
  }

  // Clear all data
  static clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.COMPETITORS);
    localStorage.removeItem(STORAGE_KEYS.IMAGES);
  }

  // Clear old images if storage is getting full
  static clearOldImagesIfNeeded(): void {
    const storageInfo = this.getStorageInfo();

    // If storage is over 80% full, clear all stored images
    if (storageInfo.percentage > 80) {
      console.log('🧹 Storage is over 80% full, clearing old images...');
      localStorage.removeItem(STORAGE_KEYS.IMAGES);

      // Also reset all competitor profilePic to default URLs
      const competitors = this.getAllCompetitors();
      const updatedCompetitors = competitors.map(competitor => ({
        ...competitor,
        profilePic: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&random=${Math.random()}`
      }));
      this.saveAllCompetitors(updatedCompetitors);
    }
  }

  // Get storage usage info
  static getStorageInfo(): { used: number, available: number, percentage: number } {
    let used = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage.getItem(key)?.length || 0;
      }
    }

    const available = 5 * 1024 * 1024; // ~5MB typical localStorage limit
    return {
      used,
      available,
      percentage: Math.round((used / available) * 100)
    };
  }

  // Manually clear all images (for debugging)
  static clearAllImages(): void {
    console.log('🗑️ Manually clearing all stored images...');
    localStorage.removeItem(STORAGE_KEYS.IMAGES);

    // Reset all competitor profilePic to default URLs
    const competitors = this.getAllCompetitors();
    const updatedCompetitors = competitors.map(competitor => ({
      ...competitor,
      profilePic: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&random=${Math.random()}`
    }));
    this.saveAllCompetitors(updatedCompetitors);
  }
}