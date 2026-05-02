import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUserTie, FaCamera } from 'react-icons/fa';

function AdminSettings({ userInfo, setUserInfo }) {
  const [profileFormData, setProfileFormData] = useState({ 
    name: userInfo?.user?.name || "", 
    email: userInfo?.user?.email || "", 
    contact: userInfo?.user?.contact || "", 
    college: userInfo?.user?.college || "",
    avatar: userInfo?.user?.avatar || ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileFormData({ ...profileFormData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const res = await axios.put("http://localhost:5000/api/admin/user/update", {
        userId: userInfo.user._id,
        ...profileFormData
      }, config);
      
      const updatedUserInfo = { ...userInfo, user: res.data.data };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      setUserInfo(updatedUserInfo);
      toast.success("Profile Settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in space-y-6">
      <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-100 max-w-4xl">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl"><FaUserTie size={24}/></div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Admin Profile Settings</h2>
        </div>
        
        <form onSubmit={handleUpdateProfile} className="space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
             <div className="relative group w-24 h-24 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl shadow-inner border-4 border-white overflow-hidden">
                {profileFormData.avatar ? (
                  <img src={profileFormData.avatar} alt="Preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                ) : (
                  <FaUserTie className="group-hover:opacity-0 transition-opacity" />
                )}
                <div className="absolute inset-0 bg-zinc-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <FaCamera size={24} />
                </div>
             </div>
             <div className="w-full">
                <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 ml-1">Profile Photo</label>
                <input type="file" accept="image/*" capture="user" onChange={handleAvatarChange} className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer" />
                <p className="text-[11px] text-slate-400 mt-2 font-medium ml-1">Upload a photo to personalize your dashboard experience.</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 ml-1">Full Name</label>
              <input type="text" value={profileFormData.name} onChange={e => setProfileFormData({...profileFormData, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" required />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 ml-1">Email Address</label>
              <input type="email" value={profileFormData.email} onChange={e => setProfileFormData({...profileFormData, email: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" required />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 ml-1">Contact Number</label>
              <input type="text" value={profileFormData.contact} onChange={e => setProfileFormData({...profileFormData, contact: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" required />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 ml-1">College / Organization</label>
              <input type="text" value={profileFormData.college} onChange={e => setProfileFormData({...profileFormData, college: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" required />
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
            <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:opacity-50">
              {isSubmitting ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminSettings;
