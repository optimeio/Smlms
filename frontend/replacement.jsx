  const renderStudentProfileView = () => {
    const displayData = user;

    // Modal UI for Edit Profile
    const renderEditModal = () => {
      if (!isEditingProfile) return null;
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-5 flex items-center justify-between rounded-t-[24px]">
              <h3 className="text-xl font-bold text-[#0F172A] m-0 tracking-tight">Edit Profile</h3>
              <button onClick={() => setIsEditingProfile(false)} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 hover:bg-slate-200 p-2 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-8 flex flex-col gap-8">
              {/* Profile Image Upload */}
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-slate-50 border border-slate-200 p-1 relative group shrink-0 shadow-sm">
                  {editProfileData.profileImage ? (
                    <img src={editProfileData.profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <div className="w-full h-full bg-[#EBF4FF] text-[#2563EB] rounded-full flex items-center justify-center text-3xl font-bold">
                      {(editProfileData.fullName || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/60 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all m-1 backdrop-blur-sm ring-2 ring-white/50">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#0F172A] m-0 mb-1">Profile Photo</h4>
                  <p className="text-[13px] text-[#64748B] m-0 leading-relaxed">Upload a clear photo to help your peers and instructors recognize you.</p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-[12px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">Full Name</label>
                  <input type="text" value={editProfileData.fullName || ''} onChange={e => setEditProfileData({...editProfileData, fullName: e.target.value})} className="w-full bg-[#F8FAFC] border border-[#E5E7EB] text-[#0F172A] text-sm font-medium rounded-xl px-4 py-3 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all shadow-sm" placeholder="Enter your full name" />
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-[12px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">About Me (Bio)</label>
                  <textarea value={editProfileData.bio || ''} onChange={e => setEditProfileData({...editProfileData, bio: e.target.value})} className="w-full bg-[#F8FAFC] border border-[#E5E7EB] text-[#0F172A] text-sm font-medium rounded-xl px-4 py-3 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all shadow-sm resize-none h-28" placeholder="Tell us about yourself..."></textarea>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">Phone Number</label>
                  <input type="text" value={editProfileData.phone || ''} onChange={e => setEditProfileData({...editProfileData, phone: e.target.value})} className="w-full bg-[#F8FAFC] border border-[#E5E7EB] text-[#0F172A] text-sm font-medium rounded-xl px-4 py-3 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all shadow-sm" placeholder="+91..." />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">Skills (Comma separated)</label>
                  <input type="text" value={Array.isArray(editProfileData.skills) ? editProfileData.skills.join(", ") : editProfileData.skills || ''} onChange={e => setEditProfileData({...editProfileData, skills: e.target.value.split(",").map(s => s.trim())})} className="w-full bg-[#F8FAFC] border border-[#E5E7EB] text-[#0F172A] text-sm font-medium rounded-xl px-4 py-3 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all shadow-sm" placeholder="e.g. React, Python" />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">College / Institution</label>
                  <input type="text" value={editProfileData.college || ''} onChange={e => setEditProfileData({...editProfileData, college: e.target.value})} className="w-full bg-[#F8FAFC] border border-[#E5E7EB] text-[#0F172A] text-sm font-medium rounded-xl px-4 py-3 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all shadow-sm" placeholder="Institution Name" />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">Department</label>
                  <input type="text" value={editProfileData.department || ''} onChange={e => setEditProfileData({...editProfileData, department: e.target.value})} className="w-full bg-[#F8FAFC] border border-[#E5E7EB] text-[#0F172A] text-sm font-medium rounded-xl px-4 py-3 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all shadow-sm" placeholder="e.g. CSE" />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">Academic Year</label>
                  <input type="text" value={editProfileData.year || ''} onChange={e => setEditProfileData({...editProfileData, year: e.target.value})} className="w-full bg-[#F8FAFC] border border-[#E5E7EB] text-[#0F172A] text-sm font-medium rounded-xl px-4 py-3 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all shadow-sm" placeholder="e.g. IV Year" />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">Register Number</label>
                  <input type="text" value={editProfileData.registerNumber || ''} onChange={e => setEditProfileData({...editProfileData, registerNumber: e.target.value})} className="w-full bg-[#F8FAFC] border border-[#E5E7EB] text-[#0F172A] text-sm font-medium rounded-xl px-4 py-3 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all shadow-sm" placeholder="Register No." />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">CGPA</label>
                  <input type="text" value={editProfileData.cgpa || ''} onChange={e => setEditProfileData({...editProfileData, cgpa: e.target.value})} className="w-full bg-[#F8FAFC] border border-[#E5E7EB] text-[#0F172A] text-sm font-medium rounded-xl px-4 py-3 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all shadow-sm" placeholder="e.g. 8.5" />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 z-10 bg-slate-50/90 backdrop-blur-xl border-t border-slate-100 px-8 py-5 flex items-center justify-end gap-3 rounded-b-[24px]">
              <button onClick={() => setIsEditingProfile(false)} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-white border border-[#E5E7EB] text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A] transition-colors shadow-sm">Cancel</button>
              <button onClick={handleProfileSave} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#2563EB] hover:bg-blue-700 text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.35)] transition-all transform hover:-translate-y-0.5">Save Profile</button>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="max-w-[1200px] mx-auto pb-12 font-['Inter'] relative">
        {renderEditModal()}

        {/* Hero Banner Section (Recreated to match image perfectly) */}
        <div className="bg-[#f0f4f8] rounded-[24px] mb-[30px] p-[40px] flex items-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #f3f8ff 0%, #e6f0fa 100%)" }}>
          {/* Subtle wave background */}
          <div className="absolute right-0 bottom-0 opacity-50">
            <svg width="600" height="200" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 200C100 150 200 180 300 120C400 60 500 100 600 50V200H0Z" fill="#dbeafe"/>
            </svg>
          </div>
          
          <div className="w-[150px] h-[150px] rounded-full bg-white p-[6px] shadow-sm relative z-10 shrink-0 border border-white">
            {displayData.profileImage ? (
              <img src={displayData.profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-slate-100 text-[#2563EB] rounded-full flex items-center justify-center text-5xl font-bold">
                {(displayData.fullName || displayData.email || '?').charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="ml-10 relative z-10 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-[32px] font-bold text-[#1e293b] m-0 tracking-tight">{displayData.fullName || "Tharaneesh"}</h2>
              <svg className="w-6 h-6 text-[#2563EB]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
              <span className="text-[14px] text-[#64748B] font-semibold">Student Member</span>
            </div>
            
            <div className="flex items-center gap-5 text-[13.5px] text-[#64748B] font-medium flex-wrap">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/></svg>
                {displayData.year || "IV Year"} {displayData.department || "CSE"}
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                {displayData.college || "Mahendra Institution"}
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                {displayData.phone || "6369067085"}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 text-[13.5px] text-[#64748B] font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              {displayData.email}
            </div>
          </div>

          <button 
            onClick={() => { setEditProfileData(displayData); setIsEditingProfile(true); }}
            className="absolute top-8 right-8 z-20 bg-[#0f172a] hover:bg-[#1e293b] text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold shadow-md transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            Edit Profile
          </button>
        </div>

        {/* 5 Stats Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-[20px] mb-[30px]">
          {/* Card 1 */}
          <div className="bg-white p-4 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#E5E7EB] flex items-center gap-4">
            <div className="w-[50px] h-[50px] rounded-[14px] bg-[#8b5cf6] text-white flex items-center justify-center shrink-0 shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            </div>
            <div>
              <div className="text-[11px] text-[#64748B] font-bold mb-0.5">Courses Enrolled</div>
              <div className="text-[20px] font-black text-[#0F172A] leading-tight mb-0.5">{(user.assignedCourses || []).length || 12}</div>
              <div className="text-[10px] text-[#8b5cf6] font-bold">Active Courses</div>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white p-4 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#E5E7EB] flex items-center gap-4">
            <div className="w-[50px] h-[50px] rounded-[14px] bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
            </div>
            <div>
              <div className="text-[11px] text-[#64748B] font-bold mb-0.5">Certificates Earned</div>
              <div className="text-[20px] font-black text-[#0F172A] leading-tight mb-0.5">{studentCertificates.length > 0 ? studentCertificates.length : "08"}</div>
              <div className="text-[10px] text-[#10B981] font-bold">View Certificates</div>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="bg-white p-4 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#E5E7EB] flex items-center gap-4">
            <div className="w-[50px] h-[50px] rounded-[14px] bg-[#f59e0b] text-white flex items-center justify-center shrink-0 shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            </div>
            <div>
              <div className="text-[11px] text-[#64748B] font-bold mb-0.5">Learning Progress</div>
              <div className="text-[20px] font-black text-[#0F172A] leading-tight mb-0.5">78%</div>
              <div className="text-[10px] text-[#f59e0b] font-bold">Keep Learning</div>
            </div>
          </div>
          
          {/* Card 4 */}
          <div className="bg-white p-4 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#E5E7EB] flex items-center gap-4">
            <div className="w-[50px] h-[50px] rounded-[14px] bg-[#3b82f6] text-white flex items-center justify-center shrink-0 shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <div>
              <div className="text-[11px] text-[#64748B] font-bold mb-0.5">Current Streak</div>
              <div className="text-[20px] font-black text-[#0F172A] leading-tight mb-0.5">21 <span className="text-[14px]">Days</span></div>
              <div className="text-[10px] text-[#3b82f6] font-bold">You're Doing Great!</div>
            </div>
          </div>
          
          {/* Card 5 */}
          <div className="bg-white p-4 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#E5E7EB] flex items-center gap-4">
            <div className="w-[50px] h-[50px] rounded-[14px] bg-[#f43f5e] text-white flex items-center justify-center shrink-0 shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
            </div>
            <div>
              <div className="text-[11px] text-[#64748B] font-bold mb-0.5">Skill Points</div>
              <div className="text-[20px] font-black text-[#0F172A] leading-tight mb-0.5">1,250</div>
              <div className="text-[10px] text-[#f43f5e] font-bold">Keep Growing</div>
            </div>
          </div>
        </div>

        {/* Main 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] mb-[30px]">
          
          {/* Card 1: About Me & Skills */}
          <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#E5E7EB] p-7 flex flex-col h-full">
            <h3 className="text-[15px] font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              About Me
            </h3>
            
            <p className="text-[13px] text-[#64748B] leading-relaxed m-0 mb-6 font-medium">
              {displayData.bio || "Passionate about Full Stack Development and problem solving. Always eager to learn new technologies and build impactful solutions."}
            </p>

            <h4 className="text-[14px] font-bold text-[#0F172A] mb-3">Skills</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              {(Array.isArray(displayData.skills) && displayData.skills.length > 0 ? displayData.skills : ["React", "Python", "JavaScript", "Node.js", "MongoDB", "HTML", "CSS", "Git"]).map((skill, idx) => (
                <span key={idx} className="bg-[#eff6ff] text-[#3b82f6] text-[11px] font-bold px-3 py-1.5 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Card 2: Academic Details */}
          <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#E5E7EB] p-7 flex flex-col h-full">
            <h3 className="text-[15px] font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/></svg>
              Academic Details
            </h3>
            
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between py-3 border-b border-[#f1f5f9]">
                <div className="flex items-center gap-2 text-[12px] font-bold text-[#64748B]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                  College
                </div>
                <div className="text-[12px] font-semibold text-[#334155]">{displayData.college || "Mahendra Institution"}</div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-[#f1f5f9]">
                <div className="flex items-center gap-2 text-[12px] font-bold text-[#64748B]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                  Department
                </div>
                <div className="text-[12px] font-semibold text-[#334155]">{displayData.department || "Computer Science Engineering"}</div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-[#f1f5f9]">
                <div className="flex items-center gap-2 text-[12px] font-bold text-[#64748B]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  Academic Year
                </div>
                <div className="text-[12px] font-semibold text-[#334155]">{displayData.year || "IV Year"}</div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-[#f1f5f9]">
                <div className="flex items-center gap-2 text-[12px] font-bold text-[#64748B]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/></svg>
                  Register Number
                </div>
                <div className="text-[12px] font-semibold text-[#334155]">{displayData.registerNumber || "MIU20CS123"}</div>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 text-[12px] font-bold text-[#64748B]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  CGPA
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-[12px] font-bold text-[#334155]">{displayData.cgpa || "8.62"} / 10</div>
                  <span className="bg-[#dcfce7] text-[#16a34a] text-[10px] font-bold px-2 py-0.5 rounded">Excellent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Recent Achievements */}
          <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#E5E7EB] p-7 flex flex-col h-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-bold text-[#0F172A] flex items-center gap-2 m-0">
                <svg className="w-5 h-5 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                Recent Achievements
              </h3>
              <button className="text-[12px] font-bold text-[#3b82f6] hover:underline transition-colors">View All</button>
            </div>
            
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex gap-4 items-center rounded-xl transition-colors">
                <div className="w-[42px] h-[42px] rounded-full bg-[#f5f3ff] text-[#8b5cf6] flex items-center justify-center shrink-0" style={{ clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)" }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                </div>
                <div className="flex-1">
                  <h5 className="text-[13px] font-bold text-[#0F172A] m-0 leading-tight">React Developer Certificate</h5>
                  <p className="text-[11px] font-medium text-[#94A3B8] m-0 mt-0.5">Issued by MBK Tech</p>
                </div>
                <div className="text-[10px] font-medium text-[#94A3B8]">Apr 20, 2024</div>
              </div>
              
              <div className="w-full h-px bg-[#f1f5f9]"></div>

              <div className="flex gap-4 items-center rounded-xl transition-colors">
                <div className="w-[42px] h-[42px] rounded-full bg-[#ecfdf5] text-[#10b981] flex items-center justify-center shrink-0" style={{ clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)" }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
                </div>
                <div className="flex-1">
                  <h5 className="text-[13px] font-bold text-[#0F172A] m-0 leading-tight">Top Performer</h5>
                  <p className="text-[11px] font-medium text-[#94A3B8] m-0 mt-0.5">Scored highest in React Assessment</p>
                </div>
                <div className="text-[10px] font-medium text-[#94A3B8]">Mar 15, 2024</div>
              </div>

              <div className="w-full h-px bg-[#f1f5f9]"></div>

              <div className="flex gap-4 items-center rounded-xl transition-colors">
                <div className="w-[42px] h-[42px] rounded-full bg-[#fff7ed] text-[#f97316] flex items-center justify-center shrink-0" style={{ clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)" }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                </div>
                <div className="flex-1">
                  <h5 className="text-[13px] font-bold text-[#0F172A] m-0 leading-tight">Python Programming</h5>
                  <p className="text-[11px] font-medium text-[#94A3B8] m-0 mt-0.5">Certificate of Completion</p>
                </div>
                <div className="text-[10px] font-medium text-[#94A3B8]">Feb 28, 2024</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion Card */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#E5E7EB] p-7 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-6">
            <div className="relative w-[70px] h-[70px] shrink-0">
              <svg className="w-[70px] h-[70px] transform -rotate-90" viewBox="0 0 70 70">
                <circle cx="35" cy="35" r="31" stroke="#F1F5F9" strokeWidth="6" fill="transparent" />
                <circle cx="35" cy="35" r="31" stroke="#3b82f6" strokeWidth="6" fill="transparent" strokeDasharray="194.7" strokeDashoffset="29.2" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[13px] font-black text-[#0F172A]">85%</div>
            </div>
            <div>
              <h4 className="text-[16px] font-bold text-[#0F172A] m-0 mb-1 tracking-tight">Profile Completion</h4>
              <p className="text-[13px] text-[#64748B] m-0 max-w-lg leading-relaxed font-medium">
                You're almost there! Complete your profile to get better recommendations and opportunities.
              </p>
            </div>
          </div>
          <button className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-6 py-3 rounded-xl text-[13px] font-semibold shadow-md transition-colors whitespace-nowrap flex items-center gap-2 group">
            Complete Profile 
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>

      </div>
    );
  };
