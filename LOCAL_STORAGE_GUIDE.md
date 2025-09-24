# GMF Biggest Loser 2025 - Local Storage Guide

## 🏠 **100% Local - No External Database Required!**

This application stores all data locally on your computer using your browser's localStorage. No account creation, no internet connection needed for data storage!

## ✨ **Features**

- **Local Data Storage**: Everything saved on your device
- **Profile Picture Upload**: Images stored locally (up to 2MB each)
- **Data Export/Import**: Backup and restore your data easily
- **Real-time Rankings**: Automatic calculation and updates
- **Blur Toggle**: Hide percentages for screenshots
- **Responsive Design**: Works on desktop and mobile

## 🚀 **Getting Started**

1. **Start the Application**:
   ```bash
   npm start
   ```

2. **First Run**: The app will initialize with sample competitors

3. **Add Real Data**:
   - Click "⚙️ Admin Panel"
   - Select a competitor to update their profile picture
   - Add new weigh-ins using the form

## 📊 **Managing Data**

### **Adding Weigh-ins**
1. Go to Admin Panel
2. Select competitor from dropdown
3. Enter date and weight
4. Click "📝 Add Weigh-In"

### **Uploading Profile Pictures**
1. Select a competitor in Admin Panel
2. Drag & drop image or click to select
3. Images are automatically compressed and stored locally
4. Max size: 2MB per image

### **Data Backup & Restore**
- **Export**: Click "📥 Export Data" to download backup file
- **Import**: Click "📤 Import Data" to restore from backup file
- **Clear**: "🗑️ Clear All Data" removes everything (with confirmation)

## 💾 **Storage Information**

- **Location**: Browser localStorage (stays on this device)
- **Capacity**: ~5MB total storage limit
- **Persistence**: Data survives browser restarts
- **Privacy**: Nothing sent to external servers

## 🔄 **Data Format**

Export files contain:
```json
{
  "competitors": [...],
  "images": {...},
  "exportDate": "2025-01-15T10:30:00.000Z"
}
```

## 📱 **Device Compatibility**

- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: Modern mobile browsers
- **Offline**: Works completely offline after loading

## 🔒 **Data Security**

- ✅ **Private**: Data never leaves your device
- ✅ **Secure**: No network transmission
- ✅ **Portable**: Export/import for backup
- ⚠️ **Device-specific**: Data tied to this browser on this device

## 🆘 **Troubleshooting**

**Storage Full?**
- Export data as backup
- Clear old data or compress images
- Check storage usage in Admin Panel

**Lost Data?**
- Check if you have export backup files
- Data is browser-specific (different browsers = different data)

**Pictures Not Loading?**
- Images stored as base64 in localStorage
- Large images may hit storage limits
- Try smaller/compressed images

## 💡 **Tips**

1. **Regular Backups**: Export data weekly
2. **Image Size**: Compress photos before upload
3. **Multiple Devices**: Use export/import to sync between devices
4. **Browser Clearing**: Exporting before clearing browser data

---

**Perfect for**: Local competitions, privacy-focused users, offline environments, or when you don't want to manage external accounts!