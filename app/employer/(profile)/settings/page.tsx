"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'

export default function EmployerSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'team'>('profile')
  const [businessUnits, setBusinessUnits] = useState(["Marketing Team", "Store Operations"])
  
  type HiringManager = { name: string; email: string; phone: string; }
  const [hiringManagers, setHiringManagers] = useState<HiringManager[]>([
    { name: "Sarah Jenkins (Store Manager)", email: "sarah@springfieldcoffee.co", phone: "555-0101" },
    { name: "David Lee (Marketing Dir.)", email: "david@springfieldcoffee.co", phone: "555-0102" }
  ])

  const predefinedBusinessUnits = [
    "Software Engineering", "Product Management", "Design", "Marketing", "Sales", "Human Resources", "Operations", "Customer Support", "Finance", "Store Operations"
  ]

  const handleUpdateBusinessUnit = (index: number, value: string) => {
    const newItems = [...businessUnits]
    newItems[index] = value
    setBusinessUnits(newItems)
  }

  const handleUpdateManager = (index: number, field: keyof HiringManager, value: string) => {
    const newManagers = [...hiringManagers]
    newManagers[index][field] = value
    setHiringManagers(newManagers)
  }
  return (
    <div className="flex flex-col gap-8">
          {/* Settings Content */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-fade-in-up md:flex">
            
            {/* Sidebar Navigation */}
            <div className="md:w-64 bg-slate-50/50 dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-6">
               <nav className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className={`flex-shrink-0 md:w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                      activeTab === 'profile' 
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 border border-brand-200 dark:border-brand-800/50 shadow-sm' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white'
                    }`}
                  >
                    General Profile
                  </button>
                  <button 
                    onClick={() => setActiveTab('team')}
                    className={`flex-shrink-0 md:w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                      activeTab === 'team' 
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 border border-brand-200 dark:border-brand-800/50 shadow-sm' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white'
                    }`}
                  >
                    Team & Structure
                  </button>
                  <button className="flex-shrink-0 md:w-full text-left px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white rounded-xl text-sm font-bold transition-colors">
                    Billing
                  </button>
               </nav>
            </div>

            {/* Profile Form */}
            <div className="flex-grow p-8 md:p-12">
              
              {activeTab === 'profile' && (
                <div className="space-y-8 animate-fade-in-up">
                  
                  {/* Logo Upload */}
                  <div className="flex flex-col md:flex-row gap-8 md:gap-14 sm:items-center py-2">
                    {/* Logo Section */}
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-[1.5rem] bg-slate-100 dark:bg-[#231A1E] border border-slate-200 dark:border-slate-800 flex items-center justify-center text-4xl shadow-sm flex-shrink-0 overflow-hidden relative group cursor-pointer">
                        <div className="w-full h-full flex items-center justify-center group-hover:opacity-60 transition-opacity">
                          ☕
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-3">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Company<br/>Logo</h3>
                        <button className="px-6 py-2 bg-white dark:bg-[#1E2536] border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-indigo-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-[#252E42] transition-colors flex flex-col items-center leading-tight shadow-sm">
                          <span>Upload</span>
                          <span>Logo</span>
                        </button>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-24 bg-slate-200 dark:bg-slate-800"></div>

                    {/* Banner Section */}
                    <div className="flex items-center gap-6">
                      <div className="w-40 h-24 rounded-2xl bg-indigo-50 dark:bg-[#4D45E4] border border-slate-200 dark:border-[#3D35B4] flex items-center justify-center overflow-hidden flex-shrink-0 relative group cursor-pointer shadow-sm">
                        <div className="absolute inset-0 opacity-20 dark:opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px', color: 'currentcolor' }}></div>
                      </div>
                      <div className="flex flex-col items-start gap-3">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Profile<br/>Banner</h3>
                        <button className="px-6 py-2 bg-white dark:bg-[#1E2536] border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-indigo-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-[#252E42] transition-colors flex flex-col items-center leading-tight shadow-sm min-w-[100px]">
                          <span>Upload</span>
                          <span>Banner</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-200 dark:bg-slate-800 w-full"></div>

                  {/* Form Fields */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Company Name</label>
                      <input 
                        type="text" 
                        defaultValue="Springfield Coffee Co."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Headquarters / Main Location</label>
                      <input 
                        type="text" 
                        defaultValue="Springfield, IL"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">About Us</label>
                      <textarea 
                        rows={5}
                        defaultValue="We are a local, independent coffee roaster dedicated to sourcing ethical beans and building community spaces. We love hiring ambitious students looking to learn."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-y"
                      ></textarea>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">This will be displayed on all your internship listings.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Website URL</label>
                      <input 
                        type="url" 
                        placeholder="https://"
                        defaultValue="https://springfieldcoffee.co"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 flex justify-end gap-3">
                    <Button className="rounded-xl shadow-brand-500/20 px-8">Save Changes</Button>
                  </div>

                </div>
              )}

              {activeTab === 'team' && (
                <div className="space-y-10 animate-fade-in-up">
                  
                  {/* Business Units Section */}
                  <section>
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Business Units</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Define the departments or teams within your company (e.g. Marketing, Store Operations).</p>
                    </div>
                    
                    <datalist id="business-units-list">
                      {predefinedBusinessUnits.map(unit => (
                        <option key={unit} value={unit} />
                      ))}
                    </datalist>

                    <div className="space-y-3">
                      {businessUnits.map((unit, index) => (
                        <div key={index} className="flex gap-3">
                          <input 
                            list="business-units-list"
                            type="text" 
                            value={unit}
                            onChange={(e) => handleUpdateBusinessUnit(index, e.target.value)}
                            placeholder="Select or type custom unit..."
                            className="flex-grow px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                          />
                          <button 
                            onClick={() => setBusinessUnits(businessUnits.filter((_, i) => i !== index))}
                            className="flex-shrink-0 px-4 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-colors border border-red-100 dark:border-red-900/50"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => setBusinessUnits([...businessUnits, ""])}
                        className="flex items-center gap-2 px-4 py-3 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-bold text-sm transition-colors border border-dashed border-brand-300 dark:border-brand-800/50 rounded-xl hover:bg-brand-50 w-full sm:w-auto"
                      >
                        <span className="text-lg leading-none">+</span> Add Business Unit
                      </button>
                    </div>
                  </section>

                  <div className="h-px bg-slate-200 dark:bg-slate-800 w-full"></div>

                  {/* Hiring Managers Section */}
                  <section>
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Hiring Managers</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Add the people who will receive and review applications.</p>
                    </div>
                    <div className="space-y-6">
                      {hiringManagers.map((manager, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-3 items-start border border-slate-200 dark:border-slate-700/50 p-5 rounded-2xl bg-white dark:bg-slate-800/30 shadow-sm relative">
                          <div className="flex-grow w-full space-y-4">
                            <div>
                               <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 block uppercase tracking-wider">Full Name & Role</label>
                               <input 
                                 type="text" 
                                 value={manager.name}
                                 placeholder="e.g. Sarah Jenkins (Store Manager)"
                                 onChange={(e) => handleUpdateManager(index, 'name', e.target.value)}
                                 className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                               />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               <div>
                                 <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 block uppercase tracking-wider">Email Address</label>
                                 <input 
                                   type="email" 
                                   value={manager.email}
                                   placeholder="sarah@company.com"
                                   onChange={(e) => handleUpdateManager(index, 'email', e.target.value)}
                                   className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                                 />
                               </div>
                               <div>
                                 <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 block uppercase tracking-wider">Phone Number</label>
                                 <input 
                                   type="tel" 
                                   value={manager.phone}
                                   placeholder="(555) 000-0000"
                                   onChange={(e) => handleUpdateManager(index, 'phone', e.target.value)}
                                   className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                                 />
                               </div>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => setHiringManagers(hiringManagers.filter((_, i) => i !== index))}
                            className="absolute sm:static top-4 right-4 flex-shrink-0 p-3 sm:px-4 sm:py-3 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-colors border border-red-100 dark:border-red-900/50"
                          >
                            <span className="hidden sm:inline">Remove</span>
                            <svg className="w-5 h-5 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => setHiringManagers([...hiringManagers, { name: "", email: "", phone: "" }])}
                        className="flex items-center gap-2 px-4 py-3 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-bold text-sm transition-colors border border-dashed border-brand-300 dark:border-brand-800/50 rounded-xl hover:bg-brand-50 w-full sm:w-auto"
                      >
                        <span className="text-lg leading-none">+</span> Add Manager
                      </button>
                    </div>
                  </section>

                  <div className="pt-6 flex justify-end gap-3">
                    <Button className="rounded-xl shadow-brand-500/20 px-8">Save Team Settings</Button>
                  </div>

                </div>
              )}

            </div>
            
          </section>
    </div>
  )
}
