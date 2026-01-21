 // src/components/admin/EpisodesManager.tsx - UPDATED WITH DARK GRAY + GREEN THEME
import React, { useState, useEffect } from 'react';
import type { Anime, Episode, Chapter } from '../../types';
import axios from 'axios';
import Spinner from '../Spinner';
import SearchableDropdown from './SearchableDropdown';

// ✅ Define DownloadLink interface locally
interface DownloadLink {
  name: string;
  url: string;
  quality?: string;
  type?: string;
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
const token = localStorage.getItem('adminToken') || '';

const EpisodesManager: React.FC = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [newItem, setNewItem] = useState({
    number: 1,
    title: '',
    session: 1,
    downloadLinks: [{ name: 'Download Link 1', url: '', quality: '', type: 'direct' }] as DownloadLink[]
  });
  const [loading, setLoading] = useState(true);
  const [animesLoading, setAnimesLoading] = useState(true);
  const [addingItem, setAddingItem] = useState(false);
  const [selectedSession, setSelectedSession] = useState<number>(1);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    number: 1,
    title: '',
    session: 1,
    downloadLinks: [{ name: 'Download Link 1', url: '', quality: '', type: 'direct' }] as DownloadLink[]
  });

  const isManga = selectedAnime?.contentType === 'Manga';

  // Get available sessions
  const getAvailableSessions = () => {
    const items = isManga ? chapters : episodes;
    const sessions = new Set<number>();
    items.forEach(item => sessions.add(item.session || 1));
    return Array.from(sessions).sort((a, b) => a - b);
  };

  // Filter items by session
  const filteredItems = (isManga ? chapters : episodes).filter(item => (item.session || 1) === selectedSession);

  useEffect(() => {
    fetchAnimes();
  }, []);

  // ✅ REFRESH FUNCTION
  const handleRefresh = async () => {
    setAnimesLoading(true);
    try {
      // 1. Refresh anime list
      const { data } = await axios.get(`${API_BASE}/admin/protected/anime-list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedAnimes = data.map((a: any) => ({
        ...a,
        id: a._id || a.id
      }));
      
      setAnimes(updatedAnimes);
      
      // 2. If selected anime exists, refresh episodes/chapters
      if (selectedAnime) {
        const updatedSelectedAnime = updatedAnimes.find((a: Anime) => a.id === selectedAnime.id);
        
        if (updatedSelectedAnime) {
          setSelectedAnime(updatedSelectedAnime);
          await fetchContent(updatedSelectedAnime.id);
        } else {
          setSelectedAnime(null);
          setEpisodes([]);
          setChapters([]);
          alert('Previously selected content was removed from the list.');
        }
      }
      
      alert('Content refreshed successfully!');
    } catch (err: any) {
      console.error('❌ Refresh error:', err.response?.data || err.message);
      alert('Failed to refresh content');
    } finally {
      setAnimesLoading(false);
    }
  };

  const fetchAnimes = async () => {
    setAnimesLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/admin/protected/anime-list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnimes(data.map((a: any) => ({
        ...a,
        id: a._id || a.id
      })));
    } catch (err: any) {
      console.error('❌ Animes load error:', err.response?.data || err.message);
      alert('Failed to load animes');
    } finally {
      setAnimesLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAnime) {
      fetchContent(selectedAnime.id);
    } else {
      setEpisodes([]);
      setChapters([]);
      setEditingItemId(null); // Reset editing state
    }
  }, [selectedAnime]);

  const fetchContent = async (contentId: string) => {
    setLoading(true);
    setEditingItemId(null); // Reset editing state on content change
    try {
      if (isManga) {
        const { data } = await axios.get(`${API_BASE}/chapters/${contentId}`);
        setChapters(data);
        const lastChapter = data.filter((ch: Chapter) => (ch.session || 1) === selectedSession);
        setNewItem(prev => ({
          ...prev,
          number: lastChapter.length > 0 ? Math.max(...lastChapter.map((ch: Chapter) => ch.chapterNumber)) + 1 : 1,
          session: selectedSession,
          downloadLinks: [{ name: 'Download Link 1', url: '', quality: '', type: 'direct' }]
        }));
      } else {
        const { data } = await axios.get(`${API_BASE}/episodes/${contentId}`);
        setEpisodes(data);
        const lastEpisode = data.filter((ep: Episode) => (ep.session || 1) === selectedSession);
        setNewItem(prev => ({
          ...prev,
          number: lastEpisode.length > 0 ? Math.max(...lastEpisode.map((ep: Episode) => ep.episodeNumber)) + 1 : 1,
          session: selectedSession,
          downloadLinks: [{ name: 'Download Link 1', url: '', quality: '', type: 'direct' }]
        }));
      }
    } catch (err: any) {
      console.error('❌ Content load error:', err.response?.data || err.message);
      alert('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit Item
  const handleEditItem = (item: Episode | Chapter) => {
    if (editingItemId === (item as any)._id) {
      // If clicking on already editing item, cancel edit
      setEditingItemId(null);
    } else {
      setEditingItemId((item as any)._id);
      
      // ✅ Get downloadLinks from item
      const itemData = item as any;
      const downloadLinks: DownloadLink[] = itemData.downloadLinks || [];
      
      // If no download links, add one default
      const linksToSet = downloadLinks.length > 0 
        ? downloadLinks 
        : [{ name: 'Download Link 1', url: '', quality: '', type: 'direct' }];
      
      setEditForm({
        number: isManga ? (item as Chapter).chapterNumber : (item as Episode).episodeNumber,
        title: item.title || '',
        session: item.session || 1,
        downloadLinks: linksToSet
      });
    }
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  // Get next available number
  const getNextAvailableNumber = () => {
    if (filteredItems.length === 0) return 1;
    const numbers = filteredItems.map(item => isManga ? (item as Chapter).chapterNumber : (item as Episode).episodeNumber);
    return Math.max(...numbers) + 1;
  };

  // ✅ Add a new download link (for add form)
  const handleAddDownloadLink = () => {
    if (newItem.downloadLinks.length >= 5) {
      alert('Maximum 5 download links allowed');
      return;
    }
    
    setNewItem(prev => ({
      ...prev,
      downloadLinks: [
        ...prev.downloadLinks,
        { 
          name: `Download Link ${prev.downloadLinks.length + 1}`, 
          url: '', 
          quality: '', 
          type: 'direct' 
        }
      ]
    }));
  };

  // ✅ Add a new download link (for edit form)
  const handleEditAddDownloadLink = () => {
    if (editForm.downloadLinks.length >= 5) {
      alert('Maximum 5 download links allowed');
      return;
    }
    
    setEditForm(prev => ({
      ...prev,
      downloadLinks: [
        ...prev.downloadLinks,
        { 
          name: `Download Link ${prev.downloadLinks.length + 1}`, 
          url: '', 
          quality: '', 
          type: 'direct' 
        }
      ]
    }));
  };

  // ✅ Remove a download link (for add form)
  const handleRemoveDownloadLink = (index: number) => {
    if (newItem.downloadLinks.length <= 1) {
      alert('At least one download link is required');
      return;
    }
    
    setNewItem(prev => ({
      ...prev,
      downloadLinks: prev.downloadLinks.filter((_, i) => i !== index)
    }));
  };

  // ✅ Remove a download link (for edit form)
  const handleEditRemoveDownloadLink = (index: number) => {
    if (editForm.downloadLinks.length <= 1) {
      alert('At least one download link is required');
      return;
    }
    
    setEditForm(prev => ({
      ...prev,
      downloadLinks: prev.downloadLinks.filter((_, i) => i !== index)
    }));
  };

  // ✅ Update download link (for add form)
  const handleUpdateDownloadLink = (index: number, field: keyof DownloadLink, value: string) => {
    setNewItem(prev => ({
      ...prev,
      downloadLinks: prev.downloadLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  // ✅ Update download link (for edit form)
  const handleEditUpdateDownloadLink = (index: number, field: keyof DownloadLink, value: string) => {
    setEditForm(prev => ({
      ...prev,
      downloadLinks: prev.downloadLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  // ✅ Validate download links (for add form)
  const validateDownloadLinks = (links: DownloadLink[]): boolean => {
    if (links.length === 0) {
      alert('At least one download link is required');
      return false;
    }
    
    if (links.length > 5) {
      alert('Maximum 5 download links allowed');
      return false;
    }
    
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      if (!link.name.trim()) {
        alert(`Download link ${i + 1} must have a name`);
        return false;
      }
      if (!link.url.trim()) {
        alert(`Download link ${i + 1} must have a URL`);
        return false;
      }
      if (!link.url.startsWith('http')) {
        alert(`Download link ${i + 1} must be a valid URL starting with http:// or https://`);
        return false;
      }
    }
    
    return true;
  };

  // Add New Item Function
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnime) {
      alert('Please select content first');
      return;
    }

    // ✅ Validate download links
    if (!validateDownloadLinks(newItem.downloadLinks)) {
      return;
    }

    setAddingItem(true);
    try {
      const endpoint = isManga ? '/chapters' : '/episodes';
      const requestBody = isManga
        ? {
            mangaId: selectedAnime.id,
            chapterNumber: newItem.number,
            title: newItem.title || `Chapter ${newItem.number}`,
            session: newItem.session,
            downloadLinks: newItem.downloadLinks
          }
        : {
            animeId: selectedAnime.id,
            episodeNumber: newItem.number,
            title: newItem.title || `Episode ${newItem.number}`,
            session: newItem.session,
            downloadLinks: newItem.downloadLinks
          };

      await axios.post(`${API_BASE}${endpoint}`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      alert(`${isManga ? 'Chapter' : 'Episode'} added successfully!`);
      
      // Reset form
      const nextNumber = getNextAvailableNumber();
      setNewItem({
        number: nextNumber,
        title: '',
        session: selectedSession,
        downloadLinks: [{ name: 'Download Link 1', url: '', quality: '', type: 'direct' }]
      });
      
      fetchContent(selectedAnime.id);
    } catch (err: any) {
      console.error('❌ Add error:', err.response?.data || err.message);
      alert(`Failed to add ${isManga ? 'chapter' : 'episode'}`);
    } finally {
      setAddingItem(false);
    }
  };

  // Update Item Function
  const handleUpdateItem = async () => {
    if (!editingItemId || !selectedAnime) return;

    // ✅ Validate download links
    if (!validateDownloadLinks(editForm.downloadLinks)) {
      return;
    }

    try {
      const endpoint = isManga ? '/chapters' : '/episodes';
      const requestBody = isManga
        ? {
            mangaId: selectedAnime.id,
            chapterNumber: editForm.number,
            title: editForm.title || `Chapter ${editForm.number}`,
            session: editForm.session,
            downloadLinks: editForm.downloadLinks
          }
        : {
            animeId: selectedAnime.id,
            episodeNumber: editForm.number,
            title: editForm.title || `Episode ${editForm.number}`,
            session: editForm.session,
            downloadLinks: editForm.downloadLinks
          };

      await axios.patch(`${API_BASE}${endpoint}`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      alert(`${isManga ? 'Chapter' : 'Episode'} updated successfully!`);
      setEditingItemId(null);
      fetchContent(selectedAnime.id);
    } catch (err: any) {
      console.error('❌ Update error:', err.response?.data || err.message);
      alert(`Failed to update ${isManga ? 'chapter' : 'episode'}`);
    }
  };

  const handleDeleteItem = async (itemId: string, itemNumber: number, session: number) => {
    if (!confirm(`Are you sure you want to delete ${isManga ? 'chapter' : 'episode'} ${itemNumber}?`)) return;

    try {
      const endpoint = isManga ? '/chapters' : '/episodes';
      await axios.delete(`${API_BASE}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          [isManga ? 'mangaId' : 'animeId']: selectedAnime?.id,
          [isManga ? 'chapterNumber' : 'episodeNumber']: itemNumber,
          session: session
        }
      });

      alert(`${isManga ? 'Chapter' : 'Episode'} deleted successfully!`);
      if (selectedAnime) {
        fetchContent(selectedAnime.id);
      }
    } catch (err: any) {
      console.error('❌ Delete error:', err.response?.data || err.message);
      alert(err.response?.data?.error || `Failed to delete ${isManga ? 'chapter' : 'episode'}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Manage {isManga ? 'Chapters' : 'Episodes'}</h2>
        <button
          onClick={handleRefresh}
          disabled={animesLoading}
          className="px-4 py-2 bg-gradient-to-r from-[#60CC3F] to-[#4CAF50] hover:from-[#4CAF50] hover:to-[#60CC3F] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm transition flex items-center gap-2 border border-[#60CC3F]"
        >
          {animesLoading ? (
            <>
              <Spinner size="sm" />
              Refreshing...
            </>
          ) : (
            '🔄 Refresh Content'
          )}
        </button>
      </div>

      {/* Content Selection - UPDATED WITH 3.5cm GAP */}
      <div className="bg-[#4A4A4A] rounded-xl p-6 border border-gray-600 mb-[3.5cm]">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Select {isManga ? 'Manga' : 'Anime/Movie'} *
        </label>
        <SearchableDropdown
          animes={animes}
          selectedAnime={selectedAnime}
          onAnimeSelect={setSelectedAnime}
          loading={animesLoading}
        />
      </div>

      {/* Selected Content Info */}
      {selectedAnime && (
        <div className="bg-[#4A4A4A] rounded-xl p-4 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-2">
            Selected: {selectedAnime.title}
          </h3>
          <div className="flex gap-4 text-sm text-gray-400">
            <span>Type: {selectedAnime.contentType}</span>
            <span>Status: {selectedAnime.status}</span>
            <span>Total {isManga ? 'Chapters' : 'Episodes'}: {isManga ? chapters.length : episodes.length}</span>
          </div>
        </div>
      )}

      {/* Session Selector */}
      {selectedAnime && getAvailableSessions().length > 0 && (
        <div className="bg-[#4A4A4A] rounded-xl p-4 border border-gray-600">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Session
          </label>
          <div className="flex flex-wrap gap-2">
            {getAvailableSessions().map(session => (
              <button
                key={session}
                onClick={() => {
                  setSelectedSession(session);
                  setNewItem(prev => ({ ...prev, session }));
                  setEditingItemId(null); // Cancel edit when changing session
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedSession === session
                    ? 'bg-gradient-to-r from-[#60CC3F] to-[#4CAF50] text-white border border-[#60CC3F]'
                    : 'bg-[#636363] text-gray-300 hover:bg-[#5a5a5a] border border-gray-600'
                }`}
              >
                Session {session}
              </button>
            ))}
            <button
              onClick={() => {
                const newSession = Math.max(...getAvailableSessions(), 0) + 1;
                setSelectedSession(newSession);
                setNewItem(prev => ({ ...prev, session: newSession, number: 1 }));
                setEditingItemId(null); // Cancel edit when adding new session
              }}
              className="px-4 py-2 bg-gradient-to-r from-[#60CC3F] to-[#4CAF50] hover:from-[#4CAF50] hover:to-[#60CC3F] text-white rounded-lg transition-colors border border-[#60CC3F]"
            >
              + New Session
            </button>
          </div>
        </div>
      )}

      {/* Add New Item Form */}
      {selectedAnime && (
        <form onSubmit={handleAddItem} className="bg-[#4A4A4A] rounded-xl p-6 space-y-4 border border-gray-600">
          <h3 className="text-lg font-semibold text-white">
            Add New {isManga ? 'Chapter' : 'Episode'} {getAvailableSessions().length > 1 && `(Session ${selectedSession})`}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {isManga ? 'Chapter' : 'Episode'} Number *
              </label>
              <input
                type="number"
                value={newItem.number}
                onChange={(e) => setNewItem({
                  ...newItem,
                  number: Math.max(1, parseInt(e.target.value) || 1)
                })}
                className="w-full bg-[#636363] border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#60CC3F] focus:border-transparent transition-colors"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Session *
              </label>
              <input
                type="number"
                value={newItem.session}
                onChange={(e) => setNewItem({
                  ...newItem,
                  session: Math.max(1, parseInt(e.target.value) || 1)
                })}
                className="w-full bg-[#636363] border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#60CC3F] focus:border-transparent transition-colors"
                min="1"
                required
              />
            </div>
          </div>

          {/* DOWNLOAD LINKS SECTION - FOR ADD FORM */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Download Links (Required) *
              </label>
              <button
                type="button"
                onClick={handleAddDownloadLink}
                disabled={newItem.downloadLinks.length >= 5}
                className="text-xs bg-gradient-to-r from-[#60CC3F] to-[#4CAF50] hover:from-[#4CAF50] hover:to-[#60CC3F] disabled:opacity-50 text-white px-2 py-1 rounded border border-[#60CC3F]"
              >
                + Add Link (Max 5)
              </button>
            </div>
            
            <div className="space-y-3">
              {newItem.downloadLinks.map((link, index) => (
                <div key={index} className="bg-[#636363] p-3 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-medium">Download Link {index + 1}</span>
                    {newItem.downloadLinks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDownloadLink(index)}
                        className="text-xs bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] hover:from-[#FF5252] hover:to-[#FF6B6B] text-white px-2 py-1 rounded border border-[#FF6B6B]"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Link Name *</label>
                      <input
                        type="text"
                        value={link.name}
                        onChange={(e) => handleUpdateDownloadLink(index, 'name', e.target.value)}
                        className="w-full bg-[#4A4A4A] border border-gray-600 text-white rounded-lg px-3 py-2 text-sm"
                        placeholder="e.g., Download Link 1, Server 1, etc."
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Quality (Optional)</label>
                      <input
                        type="text"
                        value={link.quality || ''}
                        onChange={(e) => handleUpdateDownloadLink(index, 'quality', e.target.value)}
                        className="w-full bg-[#4A4A4A] border border-gray-600 text-white rounded-lg px-3 py-2 text-sm"
                        placeholder="e.g., 720p, HD, 1080p"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-xs text-gray-400 mb-1">Download URL *</label>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleUpdateDownloadLink(index, 'url', e.target.value)}
                      className="w-full bg-[#4A4A4A] border border-gray-600 text-white rounded-lg px-3 py-2 text-sm"
                      placeholder="https://example.com/download/video.mp4"
                      required
                    />
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-xs text-gray-400 mb-1">Type (Optional)</label>
                    <select
                      value={link.type || 'direct'}
                      onChange={(e) => handleUpdateDownloadLink(index, 'type', e.target.value)}
                      className="w-full bg-[#4A4A4A] border border-gray-600 text-white rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="direct">Direct Download</option>
                      <option value="server">Server Download</option>
                      <option value="google_drive">Google Drive</option>
                      <option value="mega">Mega.nz</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-gray-400 text-xs mt-2">
              💡 You can add up to 5 download links. At least one link with name and URL is required.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {isManga ? 'Chapter' : 'Episode'} Title
            </label>
            <input
              type="text"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              placeholder={`Optional - defaults to '${isManga ? 'Chapter' : 'Episode'} X'`}
              className="w-full bg-[#636363] border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#60CC3F] focus:border-transparent transition-colors"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={addingItem || !selectedAnime}
              className="px-4 py-2 bg-gradient-to-r from-[#60CC3F] to-[#4CAF50] hover:from-[#4CAF50] hover:to-[#60CC3F] disabled:opacity-50 font-semibold text-white rounded-lg transition-colors flex items-center gap-2 border border-[#60CC3F]"
            >
              {addingItem ? (
                <>
                  <Spinner size="sm" />
                  Adding {isManga ? 'Chapter' : 'Episode'}...
                </>
              ) : (
                `Add ${isManga ? 'Chapter' : 'Episode'}`
              )}
            </button>
          </div>
        </form>
      )}

      {/* Items List */}
      {selectedAnime && (
        <div className="bg-[#4A4A4A] rounded-xl p-6 border border-gray-600">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">
              {isManga ? 'Chapters' : 'Episodes'} List {getAvailableSessions().length > 1 && `(Session ${selectedSession})`}
              ({filteredItems.length})
            </h3>
            {loading && <Spinner size="sm" />}
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner size="md" text={`Loading ${isManga ? 'chapters' : 'episodes'}...`} />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No {isManga ? 'chapters' : 'episodes'} added yet for Session {selectedSession}.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-[#636363] rounded-lg overflow-hidden">
                <thead className="bg-[#4A4A4A]">
                  <tr>
                    <th className="p-3 text-left text-gray-300 font-medium">#</th>
                    <th className="p-3 text-left text-gray-300 font-medium">Session</th>
                    <th className="p-3 text-left text-gray-300 font-medium">Title</th>
                    <th className="p-3 text-left text-gray-300 font-medium">Download Links</th>
                    <th className="p-3 text-left text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredItems.map((item: any) => {
                    const downloadLinks: DownloadLink[] = item.downloadLinks || [];
                    const isEditing = editingItemId === item._id;
                    
                    return (
                      <React.Fragment key={item._id}>
                        <tr className={`hover:bg-[#5a5a5a] transition-colors ${isEditing ? 'bg-[#636363]' : ''}`}>
                          <td className="p-3 font-mono text-gray-300">
                            {isManga ? item.chapterNumber : item.episodeNumber}
                          </td>
                          <td className="p-3">
                            <span className="text-[#60CC3F] bg-[#60CC3F]/10 px-2 py-1 rounded text-xs border border-[#60CC3F]/30">
                              S{item.session || 1}
                            </span>
                          </td>
                          <td className="p-3 text-white">{item.title}</td>
                          <td className="p-3">
                            {downloadLinks.length > 0 ? (
                              <div className="space-y-1">
                                {downloadLinks.slice(0, 2).map((link, idx) => (
                                  <div key={idx} className="text-xs">
                                    <span className="text-[#60CC3F] font-medium">{link.name}:</span>
                                    <a 
                                      href={link.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-[#60CC3F] hover:text-[#4CAF50] ml-1 truncate block max-w-xs"
                                      title={link.url}
                                    >
                                      {link.url.substring(0, 40)}...
                                    </a>
                                  </div>
                                ))}
                                {downloadLinks.length > 2 && (
                                  <div className="text-[#60CC3F] text-xs">
                                    + {downloadLinks.length - 2} more link{downloadLinks.length - 2 > 1 ? 's' : ''}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">No download links</span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditItem(item)}
                                className={`px-3 py-1 rounded text-sm transition-colors ${
                                  isEditing 
                                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white border border-yellow-600' 
                                    : 'bg-gradient-to-r from-[#60CC3F] to-[#4CAF50] hover:from-[#4CAF50] hover:to-[#60CC3F] text-white border border-[#60CC3F]'
                                }`}
                                title={isEditing ? "Cancel Edit" : "Edit"}
                              >
                                {isEditing ? '❌ Cancel Edit' : '✏️ Edit'}
                              </button>
                              {!isEditing && (
                                <button
                                  onClick={() => handleDeleteItem(item._id, isManga ? item.chapterNumber : item.episodeNumber, item.session || 1)}
                                  className="px-3 py-1 bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] hover:from-[#FF5252] hover:to-[#FF6B6B] text-white rounded text-sm transition-colors border border-[#FF6B6B]"
                                  title="Delete"
                                >
                                  🗑️ Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                        
                        {/* EDIT FORM ROW - Appears below the episode/chapter */}
                        {isEditing && (
                          <tr className="bg-[#636363] border-b border-gray-600">
                            <td colSpan={5} className="p-4">
                              <div className="border-l-4 border-yellow-500 pl-4 py-3">
                                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit {isManga ? 'Chapter' : 'Episode'} #{editForm.number}
                                </h4>
                                
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-1">
                                        {isManga ? 'Chapter' : 'Episode'} Number *
                                      </label>
                                      <input
                                        type="number"
                                        value={editForm.number}
                                        onChange={(e) => setEditForm({
                                          ...editForm,
                                          number: Math.max(1, parseInt(e.target.value) || 1)
                                        })}
                                        className="w-full bg-[#4A4A4A] border border-gray-600 text-white rounded-lg px-3 py-2 text-sm"
                                        min="1"
                                        required
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Session *
                                      </label>
                                      <input
                                        type="number"
                                        value={editForm.session}
                                        onChange={(e) => setEditForm({
                                          ...editForm,
                                          session: Math.max(1, parseInt(e.target.value) || 1)
                                        })}
                                        className="w-full bg-[#4A4A4A] border border-gray-600 text-white rounded-lg px-3 py-2 text-sm"
                                        min="1"
                                        required
                                      />
                                    </div>
                                  </div>

                                  {/* DOWNLOAD LINKS SECTION - FOR EDIT FORM */}
                                  <div>
                                    <div className="flex justify-between items-center mb-2">
                                      <label className="block text-sm font-medium text-gray-300">
                                        Download Links (Required) *
                                      </label>
                                      <button
                                        type="button"
                                        onClick={handleEditAddDownloadLink}
                                        disabled={editForm.downloadLinks.length >= 5}
                                        className="text-xs bg-gradient-to-r from-[#60CC3F] to-[#4CAF50] hover:from-[#4CAF50] hover:to-[#60CC3F] disabled:opacity-50 text-white px-2 py-1 rounded border border-[#60CC3F]"
                                      >
                                        + Add Link (Max 5)
                                      </button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                      {editForm.downloadLinks.map((link, index) => (
                                        <div key={index} className="bg-[#4A4A4A] p-3 rounded-lg border border-gray-600">
                                          <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-300 font-medium">Download Link {index + 1}</span>
                                            {editForm.downloadLinks.length > 1 && (
                                              <button
                                                type="button"
                                                onClick={() => handleEditRemoveDownloadLink(index)}
                                                className="text-xs bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] hover:from-[#FF5252] hover:to-[#FF6B6B] text-white px-2 py-1 rounded border border-[#FF6B6B]"
                                              >
                                                Remove
                                              </button>
                                            )}
                                          </div>
                                          
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                              <label className="block text-xs text-gray-400 mb-1">Link Name *</label>
                                              <input
                                                type="text"
                                                value={link.name}
                                                onChange={(e) => handleEditUpdateDownloadLink(index, 'name', e.target.value)}
                                                className="w-full bg-[#636363] border border-gray-600 text-white rounded-lg px-3 py-2 text-sm"
                                                placeholder="e.g., Download Link 1, Server 1, etc."
                                                required
                                              />
                                            </div>
                                            
                                            <div>
                                              <label className="block text-xs text-gray-400 mb-1">Quality (Optional)</label>
                                              <input
                                                type="text"
                                                value={link.quality || ''}
                                                onChange={(e) => handleEditUpdateDownloadLink(index, 'quality', e.target.value)}
                                                className="w-full bg-[#636363] border border-gray-600 text-white rounded-lg px-3 py-2 text-sm"
                                                placeholder="e.g., 720p, HD, 1080p"
                                              />
                                            </div>
                                          </div>
                                          
                                          <div className="mt-3">
                                            <label className="block text-xs text-gray-400 mb-1">Download URL *</label>
                                            <input
                                              type="url"
                                              value={link.url}
                                              onChange={(e) => handleEditUpdateDownloadLink(index, 'url', e.target.value)}
                                              className="w-full bg-[#636363] border border-gray-600 text-white rounded-lg px-3 py-2 text-sm"
                                              placeholder="https://example.com/download/video.mp4"
                                              required
                                            />
                                          </div>
                                          
                                          <div className="mt-3">
                                            <label className="block text-xs text-gray-400 mb-1">Type (Optional)</label>
                                            <select
                                              value={link.type || 'direct'}
                                              onChange={(e) => handleEditUpdateDownloadLink(index, 'type', e.target.value)}
                                              className="w-full bg-[#636363] border border-gray-600 text-white rounded-lg px-3 py-2 text-sm"
                                            >
                                              <option value="direct">Direct Download</option>
                                              <option value="server">Server Download</option>
                                              <option value="google_drive">Google Drive</option>
                                              <option value="mega">Mega.nz</option>
                                              <option value="other">Other</option>
                                            </select>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                      {isManga ? 'Chapter' : 'Episode'} Title
                                    </label>
                                    <input
                                      type="text"
                                      value={editForm.title}
                                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                      placeholder={`Optional - defaults to '${isManga ? 'Chapter' : 'Episode'} X'`}
                                      className="w-full bg-[#4A4A4A] border border-gray-600 text-white rounded-lg px-3 py-2 text-sm"
                                    />
                                  </div>

                                  <div className="flex gap-3 pt-2">
                                    <button
                                      type="button"
                                      onClick={handleUpdateItem}
                                      className="px-4 py-2 bg-gradient-to-r from-[#60CC3F] to-[#4CAF50] hover:from-[#4CAF50] hover:to-[#60CC3F] text-white font-medium rounded text-sm transition-colors flex items-center gap-2 border border-[#60CC3F]"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      Save Changes
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleCancelEdit}
                                      className="px-4 py-2 bg-[#636363] hover:bg-[#5a5a5a] text-white font-medium rounded text-sm transition-colors border border-gray-600"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EpisodesManager;