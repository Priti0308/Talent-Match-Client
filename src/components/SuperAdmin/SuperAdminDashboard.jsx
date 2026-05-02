import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaThLarge, FaUserShield, FaUsers, FaSearch,
  FaCheck, FaTimes, FaEdit, FaTrash, FaSignOutAlt,
} from "react-icons/fa";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [approvedAdmins, setApprovedAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const config = {
    headers: { Authorization: `Bearer ${userInfo?.token}` },
  };

  const fetchData = async () => {
    try {
      const pendingRes = await axios.get("https://talent-match-9rsc.onrender.com/api/admin/pending", config);
      const approvedRes = await axios.get("https://talent-match-9rsc.onrender.com/api/admin/admins", config);

      // FIXED: Both use .data.data to match backend standard
      setPendingAdmins(pendingRes.data.data || []);
      setApprovedAdmins(approvedRes.data.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    if (!userInfo || userInfo.user.role !== "superadmin") {
      navigate("/login");
    } else {
      fetchData();
    }
  }, []);

  const approveAdmin = async (id) => {
    try {
      await axios.post("https://talent-match-9rsc.onrender.com/api/admin/approve", { userId: id, status: true }, config);
      fetchData();
    } catch (err) {
      alert("Approval failed: " + (err.response?.data?.message || "Server Error"));
    }
  };

  const rejectAdmin = async (id) => {
    try {
      if (!window.confirm("Reject and delete this request?")) return;
      await axios.post("https://talent-match-9rsc.onrender.com/api/admin/approve", { userId: id, status: false }, config);
      fetchData();
    } catch (err) {
      alert("Rejection failed");
    }
  };

  const deleteAdmin = async (id) => {
    if (!window.confirm("Delete this admin?")) return;
    try {
      await axios.delete(`https://talent-match-9rsc.onrender.com/api/admin/user/delete/${id}`, config);
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const updateAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.put("https://talent-match-9rsc.onrender.com/api/admin/user/update", {
        userId: selectedUser._id,
        ...selectedUser
      }, config);
      alert("Admin Updated Successfully");
      setEditModal(false);
      fetchData();
    } catch (error) {
      alert("Update failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const renderTable = (data, isPendingTab = false) => (
    <table className="w-full text-left">
      <thead className="border-b border-cyan-500/20 text-cyan-400 uppercase text-xs">
        <tr>
          <th className="p-4">Name</th>
          <th>Email</th>
          <th>College</th>
          <th>Contact</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.filter(a => a.name.toLowerCase().includes(search.toLowerCase())).map((admin) => (
          <tr key={admin._id} className="border-b border-white/5 hover:bg-cyan-500/10 transition">
            <td className="p-4">{admin.name}</td>
            <td>{admin.email}</td>
            <td>{admin.college}</td>
            <td>{admin.contact}</td>
            <td className="flex gap-2 justify-center p-3">
              {isPendingTab && (
                <>
                  <button onClick={() => approveAdmin(admin._id)} className="bg-green-500 hover:bg-green-400 text-black px-3 py-1 rounded-lg transition"><FaCheck /></button>
                  <button onClick={() => rejectAdmin(admin._id)} className="bg-rose-500 hover:bg-rose-400 px-3 py-1 rounded-lg transition"><FaTimes /></button>
                </>
              )}
              <button onClick={() => { setSelectedUser({...admin, password: ""}); setEditModal(true); }} className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded-lg transition"><FaEdit /></button>
              <button onClick={() => deleteAdmin(admin._id)} className="bg-red-700 hover:bg-red-600 px-3 py-1 rounded-lg transition"><FaTrash /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#050505] via-[#0a0f1f] to-black text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#0b0f1a]/80 backdrop-blur-lg border-r border-cyan-500/10 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-10 tracking-widest">
            <span className="text-cyan-400">TALENT</span> MATCH
          </h1>
          {[
            { name: "Dashboard", icon: <FaThLarge /> },
            { name: "Admin Requests", icon: <FaUserShield /> },
            { name: "Accepted Admins", icon: <FaUsers /> }
          ].map((item) => (
            <button key={item.name} onClick={() => setActiveTab(item.name)} className={`flex items-center gap-3 w-full p-3 mb-3 rounded-lg transition ${activeTab === item.name ? "bg-cyan-500 text-black shadow-lg" : "hover:bg-cyan-500/10"}`}>
               {item.icon} {item.name}
            </button>
          ))}
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-rose-500 hover:text-rose-400"><FaSignOutAlt /> Logout</button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-10">
        <div className="flex justify-between mb-8">
          <h2 className="text-3xl font-bold text-cyan-400">{activeTab}</h2>
          {activeTab !== "Dashboard" && (
            <div className="relative">
              <FaSearch className="absolute top-3 left-3 text-zinc-500" />
              <input type="text" placeholder="Search..." className="bg-[#0a0a0a] border border-cyan-500/20 pl-10 pr-4 py-2 rounded-lg" onChange={(e) => setSearch(e.target.value)} />
            </div>
          )}
        </div>

        {activeTab === "Dashboard" && (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-cyan-500/20 p-8 rounded-2xl text-center shadow-lg transition">
              <p className="text-zinc-500 mb-2">Total Admins</p>
              <h3 className="text-5xl font-bold text-cyan-400">{pendingAdmins.length + approvedAdmins.length}</h3>
            </div>
            <div className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-green-500/20 p-8 rounded-2xl text-center shadow-lg transition">
              <p className="text-zinc-500 mb-2">Active Admins</p>
              <h3 className="text-5xl font-bold text-green-400">{approvedAdmins.length}</h3>
            </div>
            <div className="bg-[#0a0a0a]/60 backdrop-blur-lg border border-yellow-500/20 p-8 rounded-2xl text-center shadow-lg transition">
              <p className="text-zinc-500 mb-2">Pending</p>
              <h3 className="text-5xl font-bold text-yellow-400">{pendingAdmins.length}</h3>
            </div>
          </div>
        )}

        {activeTab === "Admin Requests" && renderTable(pendingAdmins, true)}
        {activeTab === "Accepted Admins" && renderTable(approvedAdmins, false)}
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-transparent/80 backdrop-blur-sm flex items-center justify-center z-50">
          <form onSubmit={updateAdmin} className="bg-[#0a0a0a]/80 backdrop-blur-xl p-8 rounded-2xl w-96 border border-cyan-500/30 shadow-2xl">
            <h3 className="text-2xl mb-6 text-cyan-400 text-center">Edit Admin</h3>
            <input type="text" value={selectedUser.name} onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })} className="w-full mb-3 p-3 bg-transparent border border-zinc-200 rounded-lg" placeholder="Name" />
            <input type="email" value={selectedUser.email} onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} className="w-full mb-3 p-3 bg-transparent border border-zinc-200 rounded-lg" placeholder="Email" />
            <input type="text" value={selectedUser.contact} onChange={(e) => setSelectedUser({ ...selectedUser, contact: e.target.value })} className="w-full mb-3 p-3 bg-transparent border border-zinc-200 rounded-lg" placeholder="Contact" />
            <input type="text" value={selectedUser.college} onChange={(e) => setSelectedUser({ ...selectedUser, college: e.target.value })} className="w-full mb-3 p-3 bg-transparent border border-zinc-200 rounded-lg" placeholder="College" />
            <input type="password" value={selectedUser.password || ""} onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })} className="w-full mb-5 p-3 bg-transparent border border-zinc-200 rounded-lg" placeholder="New Password (optional)" />
            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black py-2 rounded-lg font-bold">Update</button>
              <button type="button" onClick={() => { setEditModal(false); setSelectedUser(null); }} className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;