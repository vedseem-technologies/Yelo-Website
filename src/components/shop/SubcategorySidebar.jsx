'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useCategories } from '@/contexts/CategoriesContext'
import { categoryAPI } from '@/utils/api'

function SubcategorySidebar({ 
  products, 
  selectedSubcategory, 
  onSubcategorySelect, 
  type = 'brand', 
  theme = 'light',
  backendSubcategories = null 
}) {
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(false)
  const scrollContainerRef = useRef(null)
  const selectedRef = useRef(null)
  const { categories } = useCategories()

  useEffect(() => {
    if (backendSubcategories && Array.isArray(backendSubcategories) && backendSubcategories.length > 0) {
      const subcategoryList = backendSubcategories.map(sub => ({
        key: sub.slug || sub.name,
        name: sub.name,
        image: sub.image || sub.icon || '📦',
        count: sub.productCount || 0
      }))
      

      const totalCount = products?.length || 0
      subcategoryList.unshift({
        key: 'all',
        name: 'All',
        image: '📦',
        count: totalCount
      })
      
      setSubcategories(subcategoryList)
      return
    }

    if (type === 'category') {
      const processCategoriesData = (categoriesData) => {
        if (categoriesData && categoriesData.length > 0) {
          const filteredCategories = categoriesData.filter(cat => {
            if (cat.slug === 'mens-wear' && cat.image) {
              return false
            }
            return true
          })
          
          const uniqueCategories = filteredCategories.reduce((acc, cat) => {
            const existingBySlug = acc.find(c => c.slug === cat.slug)
            if (existingBySlug) {
              return acc
            }
            
            const existingByName = acc.find(c => 
              c.name?.toLowerCase() === cat.name?.toLowerCase()
            )
            if (existingByName) {
              if (!existingByName.image && cat.image) {
                const index = acc.indexOf(existingByName)
                acc[index] = cat
              }
              return acc
            }
            
            acc.push(cat)
            return acc
          }, [])

       
          const productsArray = products || []
          const categoryList = uniqueCategories
            .map(cat => {
            
              const catSlugLower = cat.slug?.toLowerCase()
              const catNameLower = cat.name?.toLowerCase()
              let localProductCount = 0
              
              for (const p of productsArray) {
                const productCategory = p.category?.toLowerCase()
                
                if (productCategory === catSlugLower || productCategory === catNameLower) {
                  localProductCount++
                  continue
                }
                
              
                if (p.subcategory && cat.subcategories?.length > 0) {
                  const productSubcat = p.subcategory.toLowerCase()
                  if (cat.subcategories.some(sub => 
                    sub.slug?.toLowerCase() === productSubcat ||
                    sub.name?.toLowerCase() === productSubcat
                  )) {
                    localProductCount++
                  }
                }
              }

              return {
                key: cat.slug,
                name: cat.name,
                image: cat.image || cat.icon || '📦',
                count: localProductCount,
                localCount: localProductCount
              }
            })
         
            .filter(cat => {
              const localCount = Number(cat.localCount) || 0
              return localCount > 0
            })

         
          const totalCount = products?.length || 0
          categoryList.unshift({
            key: 'all',
            name: 'All',
            image: '📦',
            count: totalCount
          })

          setSubcategories(categoryList)
          setLoading(false)
        }
      }
      
      if (categories && categories.length > 0) {
        processCategoriesData(categories)
        setLoading(false)
        return
      }
      
      setSubcategories([{
        key: 'all',
        name: 'All',
        image: '📦',
        count: products?.length || 0
      }])
      setLoading(false)
      
      categoryAPI.getLightweight().then(response => {
        if (response && response.success && response.data) {
          processCategoriesData(response.data)
        }
      }).catch(err => {
        console.error('Error fetching categories for sidebar:', err)
      })
      
      return
    }
    
    let subcategoryMap = new Map()
    
    products.forEach(product => {
      let key, name, image
      
      const getImageUrl = (img) => {
        if (!img) return null
        
        let url = null
        
        if (typeof img === 'string') {
          url = img
        } else if (typeof img === 'object' && img.url) {
          url = img.url
        } else {
          return null
        }
        
        if (url && url.length > 10 && (
          url.startsWith('http://') || 
          url.startsWith('https://') || 
          url.startsWith('/')
        )) {
          if (url.startsWith('http://') || url.startsWith('https://')) {
            if (url.includes('.') || url.length > 15) {
              return url
            }
          } else if (url.startsWith('/')) {
            if (url.length > 2) {
              return url
            }
          }
        }
        
        return null
      }
      
      if (type === 'productType' || type === 'subcategory') {
        key = product.subcategory || product.productType || 'Unknown'
        name = product.subcategory || product.productType || 'Unknown'
        const firstImage = product.images?.[0]
        const imageUrl = getImageUrl(firstImage)
        image = product.emoji || imageUrl || '📦'
      } else if (type === 'brand') {
        key = product.brand || 'Unknown'
        name = product.brand || 'Unknown'
        const firstImage = product.images?.[0]
        const imageUrl = getImageUrl(firstImage)
        image = product.emoji || imageUrl || '📦'
      } else if (type === 'category') {
        key = product.category || 'all'
        name = product.category || 'All'
        const firstImage = product.images?.[0]
        const imageUrl = getImageUrl(firstImage)
        image = product.emoji || imageUrl || '📦'
      } else {
        key = product.subcategory || product.productType || 'Unknown'
        name = product.subcategory || product.productType || 'Unknown'
        const firstImage = product.images?.[0]
        const imageUrl = getImageUrl(firstImage)
        image = product.emoji || imageUrl || '📦'
      }
      
      if (!subcategoryMap.has(key)) {
        subcategoryMap.set(key, {
          key,
          name,
          image,
          count: 0
        })
      }
      subcategoryMap.get(key).count++
    })
    
    const subcategoryList = Array.from(subcategoryMap.values())
      .sort((a, b) => b.count - a.count)
    
    subcategoryList.unshift({
      key: 'all',
      name: 'All',
      image: '📦',
      count: products.length
    })
    
    setSubcategories(subcategoryList)
  }, [products, type, backendSubcategories, categories])

  useEffect(() => {
    if (selectedRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const selected = selectedRef.current
      const containerRect = container.getBoundingClientRect()
      const selectedRect = selected.getBoundingClientRect()
      
      const scrollTop = container.scrollTop
      const selectedTop = selected.offsetTop
      const containerHeight = container.clientHeight
      const selectedHeight = selected.clientHeight
      
      const targetScroll = selectedTop - (containerHeight / 2) + (selectedHeight / 2)
      
      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      })
    }
  }, [selectedSubcategory])

  if (subcategories.length === 0) {
    return null
  }

  const isLuxuryTheme = theme === 'luxury'
  
  return (
    <div 
      ref={scrollContainerRef}
      className={`fixed left-0 w-20 z-20 overflow-y-auto scrollbar-hide sidebar-container ${
        isLuxuryTheme
          ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-black border-r border-yellow-500/20'
          : 'bg-white border-r border-gray-200'
      }`}
      style={{ 
        top: '0px',
        bottom: '0px',
        height: '100vh',
        paddingTop: '110px', 
        paddingBottom: '80px', 
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <style jsx global>{`
        @media (min-width: 768px) {
          .sidebar-container {
            padding-top: 0px !important;
            padding-bottom: 0px !important;
          }
        }
      `}</style>
      <div className="flex flex-col py-2">
        {subcategories.map((subcategory) => {
          const isSelected = selectedSubcategory === subcategory.key
          
          return (
            <button
              key={subcategory.key}
              ref={isSelected ? selectedRef : null}
              onClick={() => onSubcategorySelect(subcategory.key)}
              suppressHydrationWarning
              className={`
                flex flex-col items-center justify-center gap-1 py-3 px-2 
                transition-all duration-200 relative
                ${isLuxuryTheme
                  ? isSelected 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : 'text-gray-400 hover:bg-gray-800/50'
                  : isSelected 
                    ? 'bg-yellow-50 text-yellow-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full ${
                  isLuxuryTheme ? 'bg-yellow-400' : 'bg-yellow-500'
                }`} />
              )}
              
              {/* Image/Emoji */}
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center text-2xl overflow-hidden
                transition-all duration-200
                ${isLuxuryTheme
                  ? isSelected 
                    ? 'bg-yellow-500/30 ring-2 ring-yellow-400' 
                    : 'bg-gray-800/50'
                  : isSelected 
                    ? 'bg-yellow-100 ring-2 ring-yellow-500' 
                    : 'bg-gray-100'
                }
              `}>
                {(() => {
                  const img = subcategory.image
                  
                  // Check if it's a valid URL (complete and proper format)
                  const isValidUrl = img && typeof img === 'string' && (
                    (img.startsWith('http://') || img.startsWith('https://')) && img.length > 15 && img.includes('.')
                  ) || (
                    img.startsWith('/') && img.length > 2
                  )
                  
                  if (isValidUrl) {
                    return (
                      <>
                        <img 
                          src={img} 
                          alt={subcategory.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            const fallback = e.target.parentElement?.querySelector('.image-fallback')
                            if (fallback) fallback.style.display = 'block'
                          }}
                        />
                        <span className="image-fallback" style={{ display: 'none' }}>📦</span>
                      </>
                    )
                  }
                  
                  // Render as emoji/text (only if it's a single character emoji or short text)
                  // Don't render long URLs or partial strings
                  if (img && typeof img === 'string' && img.length <= 10 && !img.includes('http')) {
                    return <span>{img}</span>
                  }
                  
                  // Default emoji fallback
                  return <span>📦</span>
                })()}
              </div>
              
              {/* Name */}
              <span className={`
                text-[10px] font-medium text-center leading-tight px-1 mt-1
                ${isLuxuryTheme
                  ? isSelected ? 'text-yellow-400 font-semibold' : 'text-gray-400'
                  : isSelected ? 'text-yellow-600 font-semibold' : 'text-gray-600'
                }
              `}>
                {subcategory.name.length > 8 
                  ? subcategory.name.substring(0, 8) + '...' 
                  : subcategory.name}
              </span>
              
              {/* Count badge */}
              {subcategory.count > 0 && (
                <span className={`
                  text-[9px] px-1.5 py-0.5 rounded-full mt-0.5
                  ${isLuxuryTheme
                    ? isSelected 
                      ? 'bg-yellow-400 text-black' 
                      : 'bg-gray-700 text-gray-300'
                    : isSelected 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {subcategory.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SubcategorySidebar

