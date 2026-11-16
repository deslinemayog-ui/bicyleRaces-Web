import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  Backpack,
  Bike,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Clock,
  Cog,
  Compass,
  Database,
  Download,
  ExternalLink,
  Flag,
  Flame,
  Gauge,
  Globe,
  HelpCircle,
  Info,
  LayoutGrid,
  Lock,
  Luggage,
  Mail,
  MapPin,
  Minus,
  Mountain,
  Navigation,
  Phone,
  Plus,
  RefreshCw,
  RotateCcw,
  Route,
  Search,
  SearchX,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Sun,
  Trash2,
  Trophy,
  Truck,
  Wrench,
  X,
} from 'lucide-react';

import {
  CYCLING_EVENTS,
  EVENT_CATEGORIES,
  OFFICIAL_BICYCLE_LOGISTICS_URL,
  SA_PROVINCES,
} from './data/events';
import {
  BICYCLE_INSPECTION_SECTIONS,
  BICYCLE_TYPE_OPTIONS,
  calculateTyrePressure,
  DEFAULT_TYRE_PRESSURE_PREFS,
  PACKING_CHECKLIST_SECTIONS,
  RACE_DAY_CHECKLIST_SECTIONS,
  RIDING_CONDITION_OPTIONS,
} from './data/preparation';
import {
  BicycleType,
  BikePrepPersistedState,
  CustomPackingItem,
  CyclingEvent,
  EventCategory,
  PackingCategoryId,
  PrepChecklistSection,
  RidingCondition,
  SouthAfricanProvince,
} from './types';

const STORAGE_KEY = 'bicycle_logistics_web_prep_v1';

type MainTab = 'events' | 'preparation' | 'privacy';
type PrepSubView =
  | 'dashboard'
  | 'inspection'
  | 'tyre-pressure'
  | 'packing'
  | 'race-day';

const INITIAL_PREP_STATE: BikePrepPersistedState = {
  inspectionChecked: {},
  packingChecked: {},
  raceDayChecked: {},
  customPackingItems: [],
  tyrePressure: DEFAULT_TYRE_PRESSURE_PREFS,
  lastUpdatedIso: null,
};

function loadInitialPrepState(): BikePrepPersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PREP_STATE;
    const parsed = JSON.parse(raw) as Partial<BikePrepPersistedState>;
    return {
      inspectionChecked: parsed.inspectionChecked ?? {},
      packingChecked: parsed.packingChecked ?? {},
      raceDayChecked: parsed.raceDayChecked ?? {},
      customPackingItems: Array.isArray(parsed.customPackingItems)
        ? parsed.customPackingItems
        : [],
      tyrePressure: {
        ...DEFAULT_TYRE_PRESSURE_PREFS,
        ...(parsed.tyrePressure ?? {}),
      },
      lastUpdatedIso: parsed.lastUpdatedIso ?? null,
    };
  } catch {
    return INITIAL_PREP_STATE;
  }
}

function getTabFromLocation(): MainTab {
  if (typeof window === 'undefined') return 'events';
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
  const hash = window.location.hash.toLowerCase();
  if (path === '/privacy' || path.endsWith('/privacy') || hash === '#privacy') {
    return 'privacy';
  }
  if (
    path === '/preparation' ||
    path.endsWith('/preparation') ||
    hash === '#preparation'
  ) {
    return 'preparation';
  }
  return 'events';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>(getTabFromLocation);
  const [prepSubView, setPrepSubView] = useState<PrepSubView>('dashboard');

  const navigateToTab = (tab: MainTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const targetPath =
        tab === 'privacy'
          ? '/privacy'
          : tab === 'preparation'
            ? '/preparation'
            : '/';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ tab }, '', targetPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromLocation());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Events Directory State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<EventCategory>('All Events');
  const [selectedProvince, setSelectedProvince] =
    useState<SouthAfricanProvince>('All Locations');
  const [showRegionFilter, setShowRegionFilter] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CyclingEvent | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    return path === '/download' || path.endsWith('/download');
  });
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [simulateEmptyCatalogue, setSimulateEmptyCatalogue] = useState(false);

  // Bike Preparation Persisted State
  const [prepState, setPrepState] =
    useState<BikePrepPersistedState>(loadInitialPrepState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prepState));
    } catch {
      // Ignore storage quota errors
    }
  }, [prepState]);

  // Events sorting & filtering
  const activeCatalogue = useMemo(
    () => (simulateEmptyCatalogue ? [] : CYCLING_EVENTS),
    [simulateEmptyCatalogue]
  );

  const sortedEvents = useMemo(
    () =>
      [...activeCatalogue].sort(
        (a, b) =>
          new Date(a.sortDate).getTime() - new Date(b.sortDate).getTime()
      ),
    [activeCatalogue]
  );

  const categoryCounts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const base = sortedEvents.filter((event) => {
      const matchesProvince =
        selectedProvince === 'All Locations' ||
        event.province === selectedProvince;
      const matchesSearch =
        !q ||
        event.name.toLowerCase().includes(q) ||
        event.location.toLowerCase().includes(q) ||
        event.province.toLowerCase().includes(q) ||
        event.category.toLowerCase().includes(q) ||
        event.shortDescription.toLowerCase().includes(q);
      return matchesProvince && matchesSearch;
    });

    return EVENT_CATEGORIES.reduce(
      (acc, cat) => {
        acc[cat] =
          cat === 'All Events'
            ? base.length
            : base.filter((e) => e.category === cat).length;
        return acc;
      },
      {} as Record<EventCategory, number>
    );
  }, [sortedEvents, searchQuery, selectedProvince]);

  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sortedEvents.filter((event) => {
      const matchesCategory =
        selectedCategory === 'All Events' ||
        event.category === selectedCategory;
      const matchesProvince =
        selectedProvince === 'All Locations' ||
        event.province === selectedProvince;
      const matchesSearch =
        !q ||
        event.name.toLowerCase().includes(q) ||
        event.location.toLowerCase().includes(q) ||
        event.province.toLowerCase().includes(q) ||
        event.category.toLowerCase().includes(q) ||
        event.shortDescription.toLowerCase().includes(q);
      return matchesCategory && matchesProvince && matchesSearch;
    });
  }, [sortedEvents, selectedCategory, selectedProvince, searchQuery]);

  const featuredEvent = useMemo(
    () => sortedEvents.find((e) => e.featured) ?? sortedEvents[0] ?? null,
    [sortedEvents]
  );

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== 'All Events' ||
    selectedProvince !== 'All Locations';

  // Preparation Progress Statistics
  const inspectionStats = useMemo(() => {
    const ids = BICYCLE_INSPECTION_SECTIONS.flatMap((s) =>
      s.items.map((i) => i.id)
    );
    const completed = ids.filter(
      (id) => prepState.inspectionChecked[id]
    ).length;
    const total = ids.length;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [prepState.inspectionChecked]);

  const mergedPackingSections = useMemo<
    PrepChecklistSection<PackingCategoryId>[]
  >(() => {
    return PACKING_CHECKLIST_SECTIONS.map((sec) => {
      const customs = prepState.customPackingItems
        .filter((c) => c.categoryId === sec.id)
        .map((c) => ({ id: c.id, label: c.label, isCustom: true }));
      return {
        ...sec,
        items: [...sec.items, ...customs],
      };
    });
  }, [prepState.customPackingItems]);

  const packingStats = useMemo(() => {
    const ids = mergedPackingSections.flatMap((s) => s.items.map((i) => i.id));
    const completed = ids.filter((id) => prepState.packingChecked[id]).length;
    const total = ids.length;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [mergedPackingSections, prepState.packingChecked]);

  const raceDayStats = useMemo(() => {
    const ids = RACE_DAY_CHECKLIST_SECTIONS.flatMap((s) =>
      s.items.map((i) => i.id)
    );
    const completed = ids.filter((id) => prepState.raceDayChecked[id]).length;
    const total = ids.length;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [prepState.raceDayChecked]);

  const overallReadinessStats = useMemo(() => {
    const completed =
      inspectionStats.completed +
      packingStats.completed +
      raceDayStats.completed;
    const total =
      inspectionStats.total + packingStats.total + raceDayStats.total;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [inspectionStats, packingStats, raceDayStats]);

  const pressureEstimate = useMemo(
    () => calculateTyrePressure(prepState.tyrePressure),
    [prepState.tyrePressure]
  );

  // Prep State Mutators
  const toggleInspection = (id: string) => {
    setPrepState((prev) => ({
      ...prev,
      inspectionChecked: {
        ...prev.inspectionChecked,
        [id]: !prev.inspectionChecked[id],
      },
      lastUpdatedIso: new Date().toISOString(),
    }));
  };

  const resetInspection = () => {
    setPrepState((prev) => ({
      ...prev,
      inspectionChecked: {},
      lastUpdatedIso: new Date().toISOString(),
    }));
  };

  const togglePacking = (id: string) => {
    setPrepState((prev) => ({
      ...prev,
      packingChecked: {
        ...prev.packingChecked,
        [id]: !prev.packingChecked[id],
      },
      lastUpdatedIso: new Date().toISOString(),
    }));
  };

  const resetPacking = () => {
    setPrepState((prev) => ({
      ...prev,
      packingChecked: {},
      lastUpdatedIso: new Date().toISOString(),
    }));
  };

  const addCustomPackingItem = (
    categoryId: PackingCategoryId,
    label: string
  ) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    const newItem: CustomPackingItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      categoryId,
      label: trimmed,
      createdAt: new Date().toISOString(),
    };
    setPrepState((prev) => ({
      ...prev,
      customPackingItems: [...prev.customPackingItems, newItem],
      lastUpdatedIso: new Date().toISOString(),
    }));
  };

  const removeCustomPackingItem = (itemId: string) => {
    setPrepState((prev) => {
      const nextChecked = { ...prev.packingChecked };
      delete nextChecked[itemId];
      return {
        ...prev,
        customPackingItems: prev.customPackingItems.filter(
          (i) => i.id !== itemId
        ),
        packingChecked: nextChecked,
        lastUpdatedIso: new Date().toISOString(),
      };
    });
  };

  const toggleRaceDay = (id: string) => {
    setPrepState((prev) => ({
      ...prev,
      raceDayChecked: {
        ...prev.raceDayChecked,
        [id]: !prev.raceDayChecked[id],
      },
      lastUpdatedIso: new Date().toISOString(),
    }));
  };

  const resetRaceDay = () => {
    setPrepState((prev) => ({
      ...prev,
      raceDayChecked: {},
      lastUpdatedIso: new Date().toISOString(),
    }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Events');
    setSelectedProvince('All Locations');
  };

  const handleSimulateLoading = () => {
    setIsLoadingEvents(true);
    setTimeout(() => setIsLoadingEvents(false), 850);
  };

  return (
    <div>
      {/* Sticky Navigation Header */}
      <header className="top-navbar">
        <div className="top-navbar-inner">
          <div
            className="brand-identity"
            onClick={() => {
              navigateToTab('events');
              setSelectedEvent(null);
            }}>
            <img
              src="/icon.png"
              alt="Bicycle Logistics"
              className="brand-logo-img"
            />
            <div className="brand-title-col">
              <span className="brand-eyebrow">VIP BICYCLE TRANSPORT SA</span>
              <span className="brand-name">Bicycle Logistics</span>
            </div>
          </div>

          <nav className="nav-tabs" aria-label="Main navigation">
            <button
              type="button"
              className={`nav-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => {
                navigateToTab('events');
                setSelectedEvent(null);
              }}>
              <Calendar size={16} />
              <span>Cycling Events</span>
            </button>

            <button
              type="button"
              className={`nav-tab-btn ${activeTab === 'preparation' ? 'active' : ''}`}
              onClick={() => {
                navigateToTab('preparation');
                setPrepSubView('dashboard');
              }}>
              <Wrench size={16} />
              <span>Bike Preparation</span>
              <span className="nav-badge">
                {overallReadinessStats.percentage}%
              </span>
            </button>

            <a
              href="/privacy"
              className={`nav-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                navigateToTab('privacy');
                setSelectedEvent(null);
              }}>
              <ShieldCheck size={16} />
              <span>Privacy Policy</span>
            </a>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setShowDownloadModal(true)}
              className="btn-primary"
              style={{ padding: '10px 16px', fontSize: 13 }}>
              <Download size={16} />
              <span>Download App</span>
            </button>

            <a
              href={OFFICIAL_BICYCLE_LOGISTICS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-external-cta">
              <Truck size={16} />
              <span>bicyclelogistics.co.za</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="page-container">
        {/* Official bicyclelogistics.co.za Reference Banner */}
        <section className="official-ref-strip">
          <div className="official-ref-left">
            <div className="official-ref-icon">
              <Truck size={20} color="#6EE7B7" />
            </div>
            <p className="official-ref-text">
              <strong>Official Roll-On / Roll-Off Bike Transport:</strong>{' '}
              Transport your bicycle fully assembled in custom enclosed trailers
              to South Africa’s premier cycling events — no boxing or
              dismantling required.
            </p>
          </div>
          <a
            href={OFFICIAL_BICYCLE_LOGISTICS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="official-ref-link">
            <span>Book on bicyclelogistics.co.za</span>
            <ExternalLink size={14} />
          </a>
        </section>

        {activeTab === 'events' ? (
          <>
            {/* 1. Header & Search */}
            <section className="directory-header">
              <div className="directory-title-row">
                <div>
                  <div className="page-eyebrow">
                    <Bike size={14} />
                    <span>SOUTH AFRICAN RACE CALENDAR &amp; TRANSIT</span>
                  </div>
                  <h1 className="page-title">Cycling Events</h1>
                  <p className="page-subtitle">
                    Find your next cycling adventure.
                  </p>
                </div>
              </div>

              <div className="search-panel">
                <div className="search-row">
                  <div className="search-input-wrap">
                    <Search size={19} color="#76897E" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by race name, city or province..."
                      className="search-input"
                      aria-label="Search cycling events by name or location"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="search-clear-btn"
                        aria-label="Clear search">
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowRegionFilter((prev) => !prev)}
                    className={`region-toggle-btn ${
                      showRegionFilter || selectedProvince !== 'All Locations'
                        ? 'active'
                        : ''
                    }`}>
                    <SlidersHorizontal size={17} />
                    <span>
                      {selectedProvince === 'All Locations'
                        ? 'Region Filter'
                        : selectedProvince}
                    </span>
                  </button>
                </div>

                {(showRegionFilter || selectedProvince !== 'All Locations') && (
                  <div className="province-bar">
                    <span className="province-label">
                      <MapPin size={14} color="#14432A" />
                      Province:
                    </span>
                    {SA_PROVINCES.map((prov) => (
                      <button
                        key={prov}
                        type="button"
                        onClick={() => setSelectedProvince(prov)}
                        className={`category-chip ${
                          selectedProvince === prov ? 'active' : ''
                        }`}
                        style={{ padding: '6px 13px', fontSize: '12.5px' }}>
                        {prov}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Horizontally Scrollable Category Filter Chips */}
              <div className="category-chips-row">
                {EVENT_CATEGORIES.map((category) => {
                  const isSelected = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`category-chip ${isSelected ? 'active' : ''}`}>
                      {getCategoryIcon(category)}
                      <span>{category}</span>
                      <span className="chip-count">
                        {categoryCounts[category] ?? 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Loading / Empty / Events Content */}
            {isLoadingEvents ? (
              <div
                className="detail-card"
                style={{
                  alignItems: 'center',
                  padding: '56px 24px',
                  textAlign: 'center',
                }}>
                <RefreshCw
                  size={32}
                  color="#14432A"
                  style={{ animation: 'spin 1s linear infinite' }}
                />
                <h2 className="section-heading" style={{ marginTop: 12 }}>
                  Loading Cycling Events...
                </h2>
                <p className="section-sub">
                  Syncing South African race calendar and Bicycle Logistics
                  trailer schedules.
                </p>
              </div>
            ) : activeCatalogue.length === 0 ? (
              <div
                className="detail-card"
                style={{
                  alignItems: 'center',
                  padding: '56px 24px',
                  textAlign: 'center',
                }}>
                <Calendar size={36} color="#14432A" />
                <h2 className="section-heading">
                  No Cycling Events Listed Yet
                </h2>
                <p className="section-sub" style={{ maxWidth: 440 }}>
                  The upcoming South African cycling calendar is currently being
                  updated. Restore the sample directory below.
                </p>
                <button
                  type="button"
                  onClick={() => setSimulateEmptyCatalogue(false)}
                  className="btn-primary"
                  style={{ marginTop: 8 }}>
                  <RefreshCw size={16} />
                  <span>Load Sample SA Events</span>
                </button>
              </div>
            ) : (
              <>
                {/* 2. Featured Event Card */}
                {!hasActiveFilters && featuredEvent && (
                  <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="section-header-bar">
                      <h2 className="section-heading">Spotlight Race</h2>
                      <span
                        style={{
                          fontSize: 12.5,
                          fontWeight: 700,
                          color: 'var(--primary)',
                        }}>
                        Cape Peninsula Flagship
                      </span>
                    </div>

                    <article
                      className="featured-card"
                      onClick={() => setSelectedEvent(featuredEvent)}>
                      <div className="featured-image-wrap">
                        <img
                          src={featuredEvent.imageUrl}
                          alt={featuredEvent.name}
                          className="featured-image"
                        />
                        <div className="featured-scrim" />
                        <div className="featured-overlay-top">
                          <span className="badge-featured">
                            <Award size={14} />
                            FEATURED EVENT
                          </span>
                          <span className="badge-category-light">
                            {featuredEvent.category}
                          </span>
                        </div>
                        <div className="featured-overlay-bottom">
                          <span className="badge-transport-route">
                            <Truck size={14} color="#6EE7B7" />
                            Official bicyclelogistics.co.za Route
                          </span>
                        </div>
                      </div>

                      <div className="featured-content">
                        <div>
                          <h3 className="featured-title">
                            {featuredEvent.name}
                          </h3>
                          <p className="featured-tagline">
                            {featuredEvent.tagline}
                          </p>
                        </div>

                        <div className="featured-meta-box">
                          <div className="meta-line">
                            <span className="meta-icon-box">
                              <MapPin size={15} />
                            </span>
                            <span>{featuredEvent.location}</span>
                          </div>
                          <div className="meta-line">
                            <span className="meta-icon-box">
                              <Calendar size={15} />
                            </span>
                            <span>{featuredEvent.dateDisplay}</span>
                          </div>
                        </div>

                        <p
                          style={{
                            fontSize: 13.5,
                            color: 'var(--text-secondary)',
                            lineHeight: 1.6,
                          }}>
                          {featuredEvent.shortDescription}
                        </p>

                        <div className="featured-footer">
                          <div>
                            <div
                              style={{
                                fontSize: 10.5,
                                fontWeight: 800,
                                color: 'var(--text-muted)',
                                letterSpacing: 0.6,
                              }}>
                              DISTANCE
                            </div>
                            <div
                              style={{
                                fontSize: 13.5,
                                fontWeight: 700,
                                marginTop: 2,
                              }}>
                              {featuredEvent.distanceSummary}
                            </div>
                          </div>

                          <button type="button" className="btn-primary">
                            <span>Explore Event</span>
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    </article>
                  </section>
                )}

                {/* Active Filter Bar */}
                {hasActiveFilters && (
                  <div
                    className="detail-card"
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 20px',
                    }}>
                    <div>
                      <strong style={{ fontSize: 14 }}>
                        Showing {filteredEvents.length}{' '}
                        {filteredEvents.length === 1 ? 'event' : 'events'}
                      </strong>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: 'var(--text-secondary)',
                        }}>
                        {selectedCategory}
                        {selectedProvince !== 'All Locations'
                          ? ` • ${selectedProvince}`
                          : ''}
                        {searchQuery.trim()
                          ? ` • "${searchQuery.trim()}"`
                          : ''}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="region-toggle-btn"
                      style={{ height: 38, padding: '0 14px' }}>
                      <RotateCcw size={14} />
                      <span>Reset Filters</span>
                    </button>
                  </div>
                )}

                {/* 4. Upcoming Events Grid */}
                <section
                  style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="section-header-bar">
                    <div>
                      <h2 className="section-heading">
                        {hasActiveFilters
                          ? 'Matching Events'
                          : 'Upcoming Events'}
                      </h2>
                      <p className="section-sub">
                        Sorted chronologically • Roll-on/roll-off bike transfers
                        via{' '}
                        <a
                          href={OFFICIAL_BICYCLE_LOGISTICS_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: 'var(--primary)',
                            fontWeight: 700,
                            textDecoration: 'underline',
                          }}>
                          bicyclelogistics.co.za
                        </a>
                      </p>
                    </div>
                    <span className="page-eyebrow" style={{ marginBottom: 0 }}>
                      {filteredEvents.length} Races
                    </span>
                  </div>

                  <div className="sample-date-notice">
                    <Info
                      size={17}
                      color="#14432A"
                      style={{ flexShrink: 0 }}
                    />
                    <span>
                      Event dates shown are indicative sample windows. Always
                      verify confirmed dates, prices, and entry availability on
                      the official event organizer’s website.
                    </span>
                  </div>

                  {filteredEvents.length === 0 ? (
                    <div
                      className="detail-card"
                      style={{
                        alignItems: 'center',
                        padding: '48px 24px',
                        textAlign: 'center',
                      }}>
                      <SearchX size={36} color="#14432A" />
                      <h3 className="section-heading">
                        No Matching Cycling Events
                      </h3>
                      <p className="section-sub" style={{ maxWidth: 420 }}>
                        We couldn’t find any events matching your search or
                        category filter. Try resetting your filters below.
                      </p>
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="btn-primary"
                        style={{ marginTop: 8 }}>
                        <RotateCcw size={15} />
                        <span>Reset Search &amp; Filters</span>
                      </button>
                    </div>
                  ) : (
                    <div className="events-grid">
                      {filteredEvents.map((event) => (
                        <article
                          key={event.id}
                          className="event-card"
                          onClick={() => setSelectedEvent(event)}>
                          <div className="event-card-image-wrap">
                            <img
                              src={event.imageUrl}
                              alt={event.name}
                              className="event-card-img"
                              loading="lazy"
                            />
                            <div className="event-card-badges">
                              <span className="badge-category-solid">
                                {event.category}
                              </span>
                              {event.transport.available && (
                                <span className="badge-logistics-pill">
                                  <Truck size={12} />
                                  Bike Transport
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="event-card-body">
                            <h3 className="event-card-title">{event.name}</h3>

                            <div className="event-card-meta">
                              <div className="event-card-meta-row">
                                <MapPin size={14} color="#14432A" />
                                <span>{event.location}</span>
                              </div>
                              <div className="event-card-meta-row">
                                <Calendar size={14} color="#14432A" />
                                <span>{event.dateDisplay}</span>
                              </div>
                            </div>

                            <p className="event-card-desc">
                              {event.shortDescription}
                            </p>

                            <div className="event-card-footer">
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: 'var(--text-secondary)',
                                }}>
                                <Route size={14} />
                                {event.distanceSummary}
                              </span>

                              <span className="view-details-btn">
                                <span>View Details</span>
                                <ChevronRight size={15} />
                              </span>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}

            {/* Roll-On / Roll-Off Feature Showcase Banner */}
            <section
              className="prep-hero-banner"
              style={{ marginTop: 12, padding: 28 }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 24,
                  alignItems: 'center',
                }}>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: '#6EE7B7',
                      letterSpacing: 0.8,
                    }}>
                    BUILT BY CYCLISTS FOR CYCLISTS • BICYCLELOGISTICS.CO.ZA
                  </span>
                  <h2 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2 }}>
                    Why Box Your Bike When You Can Roll It On Ready to Race?
                  </h2>
                  <p style={{ fontSize: 14, color: '#D1E7DB', lineHeight: 1.6 }}>
                    At{' '}
                    <a
                      href={OFFICIAL_BICYCLE_LOGISTICS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#ffffff',
                        fontWeight: 700,
                        textDecoration: 'underline',
                      }}>
                      bicyclelogistics.co.za
                    </a>
                    , bicycles are transported fully assembled in custom-built,
                    enclosed trailers. Each bike stands upright in its own
                    dedicated slot, clamped securely by the wheels — preserving
                    your exact cockpit fit, hydraulic lines, and derailleur
                    indexing.
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 10,
                      marginTop: 4,
                    }}>
                    <button
                      type="button"
                      onClick={() => setShowDownloadModal(true)}
                      className="official-ref-link"
                      style={{
                        padding: '12px 20px',
                        fontSize: 13.5,
                        border: 'none',
                        cursor: 'pointer',
                      }}>
                      <Download size={16} />
                      <span>Download App &amp; More Info</span>
                    </button>
                    <a
                      href={OFFICIAL_BICYCLE_LOGISTICS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 7,
                        background: 'rgba(255,255,255,0.14)',
                        color: '#ffffff',
                        border: '1px solid rgba(167,243,208,0.35)',
                        padding: '12px 18px',
                        borderRadius: 10,
                        fontSize: 13.5,
                        fontWeight: 700,
                      }}>
                      <Truck size={16} />
                      <span>Arrange Transport at bicyclelogistics.co.za</span>
                      <ArrowUpRight size={16} />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        navigateToTab('preparation');
                        setPrepSubView('dashboard');
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.14)',
                        color: '#ffffff',
                        border: '1px solid rgba(167,243,208,0.35)',
                        padding: '12px 18px',
                        borderRadius: 10,
                        fontSize: 13.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}>
                      Open Bike Preparation Assistant
                    </button>
                  </div>
                </div>

                <div>
                  <img
                    src="/feature-graphic.png"
                    alt="Bicycle Logistics Feature Banner"
                    style={{
                      width: '100%',
                      borderRadius: 16,
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  flexWrap: 'wrap',
                  paddingTop: 8,
                  borderTop: '1px solid rgba(255,255,255,0.14)',
                }}>
                <button
                  type="button"
                  onClick={handleSimulateLoading}
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    color: '#D1E7DB',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: 999,
                    fontSize: 11.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}>
                  Preview Loading State
                </button>
                <button
                  type="button"
                  onClick={() => setSimulateEmptyCatalogue((prev) => !prev)}
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    color: '#D1E7DB',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: 999,
                    fontSize: 11.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}>
                  {simulateEmptyCatalogue
                    ? 'Restore Events Catalogue'
                    : 'Preview Empty State'}
                </button>
              </div>
            </section>

            {/* More Info: How Bicycle Logistics & The Mobile App Work */}
            <section
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="section-header-bar">
                <div>
                  <div className="page-eyebrow">
                    <HelpCircle size={14} />
                    <span>MORE INFO • APP &amp; TRANSPORT GUIDE</span>
                  </div>
                  <h2 className="section-heading">
                    How Bicycle Logistics &amp; The Mobile App Work
                  </h2>
                  <p className="section-sub">
                    Everything you need to know about our roll-on/roll-off
                    trailers, offline race prep tools, and nationwide SA hubs.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDownloadModal(true)}
                  className="btn-primary">
                  <Download size={16} />
                  <span>Download Mobile App</span>
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: 18,
                }}>
                <div className="detail-card">
                  <span className="badge-category-solid" style={{ alignSelf: 'flex-start' }}>
                    STEP 1 • BOOK ONLINE
                  </span>
                  <h3 style={{ fontSize: 17, fontWeight: 800 }}>
                    Reserve Your Event Slot
                  </h3>
                  <p
                    style={{
                      fontSize: 13.5,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}>
                    Browse upcoming South African races in the directory and
                    book your bicycle transfer directly via{' '}
                    <a
                      href={OFFICIAL_BICYCLE_LOGISTICS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'var(--primary)',
                        fontWeight: 700,
                        textDecoration: 'underline',
                      }}>
                      bicyclelogistics.co.za
                    </a>
                    .
                  </p>
                </div>

                <div className="detail-card">
                  <span className="badge-category-solid" style={{ alignSelf: 'flex-start' }}>
                    STEP 2 • ROLL ON ASSEMBLED
                  </span>
                  <h3 style={{ fontSize: 17, fontWeight: 800 }}>
                    Zero Boxing or Disassembly
                  </h3>
                  <p
                    style={{
                      fontSize: 13.5,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}>
                    Drop your bike fully assembled at a partner hub in
                    Johannesburg, Pretoria, Cape Town, Durban, or Gqeberha.
                    Each bike is clamped securely by its wheels inside enclosed
                    custom trailers.
                  </p>
                </div>

                <div className="detail-card">
                  <span className="badge-category-solid" style={{ alignSelf: 'flex-start' }}>
                    STEP 3 • RACE READY AT FINISH
                  </span>
                  <h3 style={{ fontSize: 17, fontWeight: 800 }}>
                    Collect &amp; Return Effortlessly
                  </h3>
                  <p
                    style={{
                      fontSize: 13.5,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}>
                    Collect your bike at the race precinct, use our offline
                    Mobile App checklists &amp; Tyre Pressure Guide on race
                    morning, and hand your bike back at the finish compound.
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: 18,
                }}>
                <div className="detail-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="meta-icon-box">
                      <Smartphone size={17} />
                    </span>
                    <h3 style={{ fontSize: 16.5, fontWeight: 800 }}>
                      Inside the Bicycle Logistics App
                    </h3>
                  </div>
                  <div className="services-checklist">
                    <div className="service-item">
                      <CheckCircle2 size={16} color="#14432A" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>
                        <strong>Offline-First Race Prep:</strong> Bicycle
                        Inspection, Packing, and Race Day checklists saved
                        locally on your phone — no signal needed at remote race
                        villages.
                      </span>
                    </div>
                    <div className="service-item">
                      <CheckCircle2 size={16} color="#14432A" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>
                        <strong>Tyre Pressure Calculator:</strong> Starting PSI
                        &amp; BAR estimates for Road, Gravel, and MTB setups.
                      </span>
                    </div>
                    <div className="service-item">
                      <CheckCircle2 size={16} color="#14432A" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>
                        <strong>Zero Account &amp; Zero Permissions:</strong> No
                        login, no GPS tracking, no camera, and no contacts
                        access.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="meta-icon-box">
                      <HelpCircle size={17} />
                    </span>
                    <h3 style={{ fontSize: 16.5, fontWeight: 800 }}>
                      Frequently Asked Questions
                    </h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700 }}>
                        Do I need to remove pedals or handlebars?
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        No. Our custom trailers hold your bicycle upright and
                        fully assembled, preserving your exact bike fit and
                        aero/TT cockpit setup.
                      </p>
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700 }}>
                        Which point-to-point races are covered?
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        Major SA events including Cape Town Cycle Tour, kapow!
                        sani2c, Trans Baviaans, Wines2Whales, The 947 Ride
                        Joburg, Amashova, and IRONMAN South Africa.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : activeTab === 'preparation' ? (
          /* BIKE PREPARATION TAB */
          <BikePreparationWebSection
            subView={prepSubView}
            onSelectSubView={setPrepSubView}
            prepState={prepState}
            setPrepState={setPrepState}
            inspectionStats={inspectionStats}
            packingStats={packingStats}
            raceDayStats={raceDayStats}
            overallReadinessStats={overallReadinessStats}
            pressureEstimate={pressureEstimate}
            mergedPackingSections={mergedPackingSections}
            onToggleInspection={toggleInspection}
            onResetInspection={resetInspection}
            onTogglePacking={togglePacking}
            onResetPacking={resetPacking}
            onAddCustomPacking={addCustomPackingItem}
            onRemoveCustomPacking={removeCustomPackingItem}
            onToggleRaceDay={toggleRaceDay}
            onResetRaceDay={resetRaceDay}
          />
        ) : (
          /* PRIVACY POLICY TAB */
          <WebPrivacyPolicySection
            onBackToEvents={() => navigateToTab('events')}
          />
        )}
      </main>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* Download App & More Info Modal */}
      {showDownloadModal && (
        <DownloadAppModal
          onClose={() => {
            setShowDownloadModal(false);
            if (
              typeof window !== 'undefined' &&
              window.location.pathname.endsWith('/download')
            ) {
              window.history.pushState({ tab: activeTab }, '', '/');
            }
          }}
          onOpenPrivacy={() => {
            setShowDownloadModal(false);
            navigateToTab('privacy');
          }}
        />
      )}

      {/* Website Footer referencing bicyclelogistics.co.za */}
      <footer className="site-footer">
        <div className="site-footer-inner">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img
                src="/icon.png"
                alt="Bicycle Logistics"
                style={{ width: 40, height: 40, borderRadius: 10 }}
              />
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#6EE7B7',
                    letterSpacing: 0.8,
                  }}>
                  VIP BICYCLE TRANSPORT &amp; LOGISTICS
                </div>
                <div
                  style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>
                  Bicycle Logistics South Africa
                </div>
              </div>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#B8D8C7' }}>
              Specialized roll-on, roll-off assembled bicycle transport to major
              road, mountain bike, gravel, and triathlon events across South
              Africa. Built by cyclists, for cyclists.
            </p>
            <div>
              <a
                href={OFFICIAL_BICYCLE_LOGISTICS_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#6EE7B7',
                  fontWeight: 700,
                  fontSize: 13.5,
                }}>
                <Globe size={15} />
                <span>https://www.bicyclelogistics.co.za/</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: 0.6,
                textTransform: 'uppercase',
              }}>
              Platform Navigation
            </h4>
            <button
              type="button"
              onClick={() => {
                navigateToTab('events');
                setSelectedEvent(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#D1E7DB',
                textAlign: 'left',
                fontSize: 13.5,
                cursor: 'pointer',
              }}>
              SA Cycling Events Directory
            </button>
            <button
              type="button"
              onClick={() => {
                navigateToTab('preparation');
                setPrepSubView('inspection');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#D1E7DB',
                textAlign: 'left',
                fontSize: 13.5,
                cursor: 'pointer',
              }}>
              Bicycle Inspection Checklist
            </button>
            <button
              type="button"
              onClick={() => {
                navigateToTab('preparation');
                setPrepSubView('tyre-pressure');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#D1E7DB',
                textAlign: 'left',
                fontSize: 13.5,
                cursor: 'pointer',
              }}>
              Tyre Pressure Guide (PSI &amp; BAR)
            </button>
            <button
              type="button"
              onClick={() => {
                navigateToTab('preparation');
                setPrepSubView('packing');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#D1E7DB',
                textAlign: 'left',
                fontSize: 13.5,
                cursor: 'pointer',
              }}>
              Event Packing &amp; Race Day Checklists
            </button>
            <a
              href="/privacy"
              onClick={(e) => {
                e.preventDefault();
                navigateToTab('privacy');
                setSelectedEvent(null);
              }}
              style={{
                color: '#6EE7B7',
                fontWeight: 700,
                textAlign: 'left',
                fontSize: 13.5,
                cursor: 'pointer',
              }}>
              Privacy Policy (/privacy)
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: 0.6,
                textTransform: 'uppercase',
              }}>
              Official Enquiries &amp; Bookings
            </h4>
            <a
              href={OFFICIAL_BICYCLE_LOGISTICS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13.5,
                color: '#D1E7DB',
              }}>
              <Globe size={15} color="#6EE7B7" />
              <span>www.bicyclelogistics.co.za</span>
            </a>
            <a
              href="mailto:bookings@bicyclelogistics.co.za"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13.5,
                color: '#D1E7DB',
              }}>
              <Mail size={15} color="#6EE7B7" />
              <span>bookings@bicyclelogistics.co.za</span>
            </a>
            <a
              href="tel:+27825715557"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13.5,
                color: '#D1E7DB',
              }}>
              <Phone size={15} color="#6EE7B7" />
              <span>082 571 5557 (Barend van Heerden)</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function getCategoryIcon(category: EventCategory) {
  const size = 15;
  switch (category) {
    case 'All Events':
      return <LayoutGrid size={size} />;
    case 'Road Cycling':
      return <Bike size={size} />;
    case 'Mountain Biking':
      return <Mountain size={size} />;
    case 'Gravel':
      return <Compass size={size} />;
    case 'Ultra Cycling':
      return <Flame size={size} />;
    case 'Triathlon':
      return <Trophy size={size} />;
  }
}

/* ============================================================================
 * EVENT DETAILS MODAL
 * ============================================================================ */
function EventDetailsModal({
  event,
  onClose,
}: {
  event: CyclingEvent;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="detail-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={event.name}>
        <div className="detail-hero">
          <img
            src={event.imageUrl}
            alt={event.name}
            className="detail-hero-img"
          />
          <div className="featured-scrim" />

          <div className="featured-overlay-top">
            <button
              type="button"
              onClick={onClose}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: 'rgba(255,255,255,0.95)',
                color: 'var(--text-primary)',
                border: 'none',
                padding: '9px 15px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}>
              <ArrowLeft size={16} />
              <span>Back to Events</span>
            </button>

            <span className="badge-category-solid" style={{ fontSize: 12 }}>
              {event.category}
            </span>
          </div>

          <div className="featured-overlay-bottom">
            <span className="badge-transport-route">
              <MapPin size={13} color="#6EE7B7" />
              {event.province}
            </span>
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-card">
            <div>
              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: -0.5,
                  color: 'var(--text-primary)',
                }}>
                {event.name}
              </h2>
              <p
                style={{
                  fontSize: 14.5,
                  color: 'var(--text-secondary)',
                  marginTop: 4,
                }}>
                {event.tagline}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 12,
              }}>
              <div className="meta-line">
                <span className="meta-icon-box">
                  <MapPin size={16} />
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: 'var(--text-muted)',
                    }}>
                    LOCATION
                  </div>
                  <div>{event.location}</div>
                </div>
              </div>

              <div className="meta-line">
                <span className="meta-icon-box">
                  <Calendar size={16} />
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: 'var(--text-muted)',
                    }}>
                    EVENT SCHEDULE
                  </div>
                  <div>{event.dateDisplay}</div>
                </div>
              </div>
            </div>

            {event.isSampleDate && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  background: 'var(--warm-surface)',
                  border: '1px solid var(--warm-border)',
                  padding: 12,
                  borderRadius: 12,
                  fontSize: 12.5,
                  color: '#92400E',
                }}>
                <Clock size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>
                  Indicative sample date window shown. Check the official event
                  website below for confirmed race dates, entry fees, and
                  registration availability.
                </span>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                paddingTop: 4,
              }}>
              <a
                href={event.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-external-cta">
                <Globe size={16} />
                <span>
                  Official Event Website (
                  {event.websiteUrl.replace(/^https?:\/\//, '')})
                </span>
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

          {/* Route Specs & Description */}
          <div className="detail-card">
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>About the Event</h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 12,
                background: 'var(--bg)',
                padding: 14,
                borderRadius: 12,
                border: '1px solid var(--border)',
              }}>
              <div>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    color: 'var(--text-muted)',
                  }}>
                  DISTANCE
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 2 }}>
                  {event.distanceSummary}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    color: 'var(--text-muted)',
                  }}>
                  TERRAIN
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 2 }}>
                  {event.terrainSummary}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    color: 'var(--text-muted)',
                  }}>
                  FORMAT
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 2 }}>
                  {event.formatSummary}
                </div>
              </div>
            </div>

            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                whiteSpace: 'pre-line',
              }}>
              {event.description}
            </p>
          </div>

          {/* Bicycle Transportation Information referencing bicyclelogistics.co.za */}
          <div className="logistics-highlight-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Truck size={22} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    color: 'var(--primary)',
                    letterSpacing: 0.7,
                  }}>
                  BICYCLELOGISTICS.CO.ZA OFFICIAL TRANSIT
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 800 }}>
                  Bicycle Transportation Information
                </h3>
              </div>
            </div>

            <p
              style={{
                fontSize: 14,
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}>
              {event.transport.summary}
            </p>

            <div
              style={{
                background: 'var(--primary-surface)',
                border: '1px solid var(--primary-border)',
                borderRadius: 12,
                padding: 14,
              }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  fontSize: 13,
                  fontWeight: 800,
                  color: 'var(--primary)',
                }}>
                <Navigation size={15} />
                <span>Race Precinct Drop-Off &amp; Collection</span>
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  marginTop: 4,
                  color: 'var(--text-primary)',
                }}>
                {event.transport.dropOffPoint}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>
                Nationwide Collection &amp; Return Hubs
              </h4>
              <div className="hubs-wrap">
                {event.transport.collectionHubs.map((hub) => (
                  <span key={hub} className="hub-pill">
                    <MapPin size={13} color="#14432A" />
                    {hub}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>
                What’s Included with Your Roll-On / Roll-Off Bike Transfer
              </h4>
              <div className="services-checklist">
                {event.transport.includedServices.map((srv) => (
                  <div key={srv} className="service-item">
                    <CheckCircle2
                      size={16}
                      color="#14432A"
                      style={{ flexShrink: 0, marginTop: 2 }}
                    />
                    <span>{srv}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--surface-subtle)',
                padding: 12,
                borderRadius: 10,
                fontSize: 12.5,
                color: 'var(--text-secondary)',
              }}>
              <ShieldCheck size={16} color="#14432A" />
              <span>{event.transport.cutoffNotice}</span>
            </div>

            <a
              href={OFFICIAL_BICYCLE_LOGISTICS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ padding: '15px 22px', fontSize: 15 }}>
              <Truck size={18} />
              <span>Arrange Bicycle Transport on bicyclelogistics.co.za</span>
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * BIKE PREPARATION WEB SECTION (DASHBOARD + 4 MODULES)
 * ============================================================================ */
interface BikePrepWebProps {
  subView: PrepSubView;
  onSelectSubView: (view: PrepSubView) => void;
  prepState: BikePrepPersistedState;
  setPrepState: React.Dispatch<React.SetStateAction<BikePrepPersistedState>>;
  inspectionStats: { completed: number; total: number; percentage: number };
  packingStats: { completed: number; total: number; percentage: number };
  raceDayStats: { completed: number; total: number; percentage: number };
  overallReadinessStats: {
    completed: number;
    total: number;
    percentage: number;
  };
  pressureEstimate: ReturnType<typeof calculateTyrePressure>;
  mergedPackingSections: PrepChecklistSection<PackingCategoryId>[];
  onToggleInspection: (id: string) => void;
  onResetInspection: () => void;
  onTogglePacking: (id: string) => void;
  onResetPacking: () => void;
  onAddCustomPacking: (categoryId: PackingCategoryId, label: string) => void;
  onRemoveCustomPacking: (id: string) => void;
  onToggleRaceDay: (id: string) => void;
  onResetRaceDay: () => void;
}

function BikePreparationWebSection({
  subView,
  onSelectSubView,
  prepState,
  setPrepState,
  inspectionStats,
  packingStats,
  raceDayStats,
  overallReadinessStats,
  pressureEstimate,
  mergedPackingSections,
  onToggleInspection,
  onResetInspection,
  onTogglePacking,
  onResetPacking,
  onAddCustomPacking,
  onRemoveCustomPacking,
  onToggleRaceDay,
  onResetRaceDay,
}: BikePrepWebProps) {
  if (subView === 'inspection') {
    return (
      <WebChecklistModule
        eyebrow="PRE-EVENT MECHANICAL AUDIT"
        title="Bicycle Inspection"
        subtitle="Complete these 16 mechanical safety checks before handing over your assembled bike to Bicycle Logistics (bicyclelogistics.co.za) or heading to the start line."
        sections={BICYCLE_INSPECTION_SECTIONS}
        checkedMap={prepState.inspectionChecked}
        stats={inspectionStats}
        onToggle={onToggleInspection}
        onReset={onResetInspection}
        onBack={() => onSelectSubView('dashboard')}
        renderIcon={(id) => {
          switch (id) {
            case 'brakes':
              return <ShieldAlert size={18} />;
            case 'tyres-wheels':
              return <CircleDot size={18} />;
            case 'drivetrain':
              return <Cog size={18} />;
            default:
              return <Wrench size={18} />;
          }
        }}
      />
    );
  }

  if (subView === 'packing') {
    return (
      <WebChecklistModule
        eyebrow="GEAR, NUTRITION & TRAVEL DOCS"
        title="Packing Checklist"
        subtitle="Tick off your riding kit, on-bike spares, personal essentials and Bicycle Logistics transport confirmations. Add custom items to any section."
        sections={mergedPackingSections}
        checkedMap={prepState.packingChecked}
        stats={packingStats}
        onToggle={onTogglePacking}
        onReset={onResetPacking}
        onBack={() => onSelectSubView('dashboard')}
        allowCustomItems
        onAddCustom={onAddCustomPacking}
        onRemoveCustom={onRemoveCustomPacking}
        renderIcon={(id) => {
          switch (id) {
            case 'bicycle-equipment':
              return <Bike size={18} />;
            case 'personal-essentials':
              return <Backpack size={18} />;
            default:
              return <Luggage size={18} />;
          }
        }}
      />
    );
  }

  if (subView === 'race-day') {
    return (
      <WebChecklistModule
        eyebrow="EVENT EXECUTION TIMELINE"
        title="Race Day Checklist"
        subtitle="Stay calm and focused on race morning with structured checklists for before leaving, in the start paddock, and after crossing the finish line."
        sections={RACE_DAY_CHECKLIST_SECTIONS}
        checkedMap={prepState.raceDayChecked}
        stats={raceDayStats}
        onToggle={onToggleRaceDay}
        onReset={onResetRaceDay}
        onBack={() => onSelectSubView('dashboard')}
        renderIcon={(id) => {
          switch (id) {
            case 'before-leaving':
              return <Sun size={18} />;
            case 'before-race':
              return <Flag size={18} />;
            default:
              return <Award size={18} />;
          }
        }}
      />
    );
  }

  if (subView === 'tyre-pressure') {
    return (
      <WebTyrePressureModule
        prefs={prepState.tyrePressure}
        recommendation={pressureEstimate}
        onChangePrefs={(updates) =>
          setPrepState((prev) => ({
            ...prev,
            tyrePressure: { ...prev.tyrePressure, ...updates },
            lastUpdatedIso: new Date().toISOString(),
          }))
        }
        onResetPrefs={() =>
          setPrepState((prev) => ({
            ...prev,
            tyrePressure: DEFAULT_TYRE_PRESSURE_PREFS,
            lastUpdatedIso: new Date().toISOString(),
          }))
        }
        onBack={() => onSelectSubView('dashboard')}
      />
    );
  }

  // Dashboard View
  const cards = [
    {
      id: 'inspection' as const,
      subtitle: 'PRE-EVENT MECHANICAL CHECK',
      title: 'Bicycle Inspection',
      description:
        'Systematically inspect brakes, tyres, wheels, drivetrain and frame components before loading your bike.',
      badge: `${inspectionStats.completed}/${inspectionStats.total} Checked`,
      percentage: inspectionStats.percentage,
      actionLabel: 'Start Inspection',
      icon: <Wrench size={22} color="#14432A" />,
    },
    {
      id: 'tyre-pressure' as const,
      subtitle: 'SURFACE & LOAD REFERENCE',
      title: 'Tyre Pressure Guide',
      description:
        'Calculate estimated starting PSI and BAR for Road, Gravel or Mountain Bike setups across SA terrain.',
      badge: `${prepState.tyrePressure.bicycleType} • ${pressureEstimate.frontPsi}/${pressureEstimate.rearPsi} PSI`,
      percentage: null,
      actionLabel: 'Open Pressure Calculator',
      icon: <Gauge size={22} color="#14432A" />,
    },
    {
      id: 'packing' as const,
      subtitle: 'KIT, TOOLS & TRAVEL DOCS',
      title: 'Packing Checklist',
      description:
        'Track bicycle equipment, personal race essentials, transport confirmations and your own custom gear.',
      badge: `${packingStats.completed}/${packingStats.total} Packed`,
      percentage: packingStats.percentage,
      actionLabel: 'Manage Packing List',
      icon: <Backpack size={22} color="#14432A" />,
    },
    {
      id: 'race-day' as const,
      subtitle: 'MORNING, PADDOCK & POST-RACE',
      title: 'Race Day Checklist',
      description:
        'Step-by-step race morning timeline from leaving accommodation to post-finish bike return logistics.',
      badge: `${raceDayStats.completed}/${raceDayStats.total} Completed`,
      percentage: raceDayStats.percentage,
      actionLabel: 'View Race Day Plan',
      icon: <Flag size={22} color="#14432A" />,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div className="page-eyebrow">
          <Sparkles size={14} />
          <span>BICYCLE LOGISTICS PREP ASSISTANT</span>
        </div>
        <h1 className="page-title">Bike Preparation</h1>
        <p className="page-subtitle">Everything you need to get race-ready.</p>
      </div>

      {/* Hero Readiness Banner */}
      <div className="prep-hero-banner">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#6EE7B7',
                letterSpacing: 0.8,
              }}>
              OVERALL RACE READINESS • SAVED LOCALLY IN BROWSER
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>
              {overallReadinessStats.percentage === 100
                ? 'Your bike and gear are 100% race-ready!'
                : `${overallReadinessStats.completed} of ${overallReadinessStats.total} preparation tasks completed`}
            </h2>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.14)',
              border: '1px solid rgba(167,243,208,0.3)',
              borderRadius: 14,
              padding: '10px 18px',
              fontSize: 28,
              fontWeight: 800,
            }}>
            {overallReadinessStats.percentage}%
          </div>
        </div>

        <div className="prep-progress-track">
          <div
            className="prep-progress-fill"
            style={{ width: `${overallReadinessStats.percentage}%` }}
          />
        </div>
      </div>

      {/* Four Utility Cards */}
      <div className="prep-utilities-grid">
        {cards.map((card) => (
          <article
            key={card.id}
            className="prep-utility-card"
            onClick={() => onSelectSubView(card.id)}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: 'var(--primary-surface)',
                  border: '1px solid var(--primary-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {card.icon}
              </div>

              <span
                style={{
                  background: 'var(--surface-subtle)',
                  color: 'var(--primary)',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '6px 12px',
                  borderRadius: 999,
                }}>
                {card.badge}
              </span>
            </div>

            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: 'var(--primary)',
                  letterSpacing: 0.5,
                }}>
                {card.subtitle}
              </div>
              <h3 style={{ fontSize: 21, fontWeight: 800, marginTop: 2 }}>
                {card.title}
              </h3>
              <p
                style={{
                  fontSize: 13.5,
                  color: 'var(--text-secondary)',
                  marginTop: 6,
                  lineHeight: 1.55,
                }}>
                {card.description}
              </p>
            </div>

            {typeof card.percentage === 'number' ? (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    fontWeight: 700,
                    marginBottom: 6,
                  }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Completion Progress
                  </span>
                  <span style={{ color: 'var(--primary)' }}>
                    {card.percentage}%
                  </span>
                </div>
                <div
                  style={{
                    height: 8,
                    background: 'var(--surface-subtle)',
                    borderRadius: 999,
                    overflow: 'hidden',
                  }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${card.percentage}%`,
                      background: 'var(--primary)',
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: '10px 14px',
                }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: 'var(--text-muted)',
                  }}>
                  ACTIVE SETUP ({prepState.tyrePressure.bicycleType.toUpperCase()}{' '}
                  • {prepState.tyrePressure.tyreWidthMm}MM •{' '}
                  {prepState.tyrePressure.riderWeightKg}KG)
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--primary)',
                    marginTop: 2,
                  }}>
                  Front {pressureEstimate.frontPsi} PSI (
                  {pressureEstimate.frontBar} BAR) • Rear{' '}
                  {pressureEstimate.rearPsi} PSI ({pressureEstimate.rearBar}{' '}
                  BAR)
                </div>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 12,
                borderTop: '1px solid var(--border)',
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: 13.5,
              }}>
              <span>{card.actionLabel}</span>
              <ArrowRight size={16} />
            </div>
          </article>
        ))}
      </div>

      {/* Pro Transit Tip */}
      <div className="sample-date-notice" style={{ padding: 18 }}>
        <ClipboardCheck size={22} color="#14432A" style={{ flexShrink: 0 }} />
        <div>
          <strong style={{ color: 'var(--primary)', display: 'block' }}>
            Pre-Transit Mechanical Tip for Bicycle Logistics Riders
          </strong>
          <span>
            Complete your Bicycle Inspection at least 48 hours before dropping
            your bike at a{' '}
            <a
              href={OFFICIAL_BICYCLE_LOGISTICS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: 700, textDecoration: 'underline' }}>
              bicyclelogistics.co.za
            </a>{' '}
            collection hub so any worn brake pads, tyres, or cables can be
            serviced before your bike is loaded onto our roll-on/roll-off
            trailers.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * REUSABLE INTERACTIVE CHECKLIST WEB MODULE
 * ============================================================================ */
function WebChecklistModule<TCategoryId extends string>({
  eyebrow,
  title,
  subtitle,
  sections,
  checkedMap,
  stats,
  onToggle,
  onReset,
  onBack,
  renderIcon,
  allowCustomItems,
  onAddCustom,
  onRemoveCustom,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  sections: PrepChecklistSection<TCategoryId>[];
  checkedMap: Record<string, boolean>;
  stats: { completed: number; total: number; percentage: number };
  onToggle: (id: string) => void;
  onReset: () => void;
  onBack: () => void;
  renderIcon: (id: TCategoryId) => React.ReactNode;
  allowCustomItems?: boolean;
  onAddCustom?: (categoryId: TCategoryId, label: string) => void;
  onRemoveCustom?: (id: string) => void;
}) {
  const [addingTo, setAddingTo] = useState<TCategoryId | null>(null);
  const [draft, setDraft] = useState('');

  const handleSaveCustom = (catId: TCategoryId) => {
    if (!draft.trim() || !onAddCustom) return;
    onAddCustom(catId, draft.trim());
    setDraft('');
    setAddingTo(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}>
        <button
          type="button"
          onClick={onBack}
          className="region-toggle-btn"
          style={{ height: 40, padding: '0 16px' }}>
          <ArrowLeft size={16} />
          <span>Back to Bike Preparation</span>
        </button>

        {stats.completed > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="region-toggle-btn"
            style={{ height: 40, padding: '0 16px' }}>
            <RotateCcw size={15} />
            <span>Reset Checklist</span>
          </button>
        )}
      </div>

      <div>
        <div className="page-eyebrow">{eyebrow}</div>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>

      {/* Progress Bar Card */}
      <div className="prep-hero-banner">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#6EE7B7',
                letterSpacing: 0.7,
              }}>
              {stats.percentage === 100
                ? '100% COMPLETE & RACE READY'
                : 'CHECKLIST COMPLETION'}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>
              {stats.completed} of {stats.total} checks completed
            </div>
          </div>
          <div style={{ fontSize: 34, fontWeight: 800 }}>
            {stats.percentage}%
          </div>
        </div>
        <div className="prep-progress-track">
          <div
            className="prep-progress-fill"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
      </div>

      {/* Category Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {sections.map((section) => {
          const doneCount = section.items.filter(
            (i) => checkedMap[i.id]
          ).length;
          return (
            <div key={section.id} className="checklist-section-card">
              <div className="checklist-section-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="meta-icon-box" style={{ width: 38, height: 38 }}>
                    {renderIcon(section.id)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 800 }}>
                      {section.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 12.5,
                        color: 'var(--text-secondary)',
                      }}>
                      {section.subtitle}
                    </p>
                  </div>
                </div>

                <span className="badge-category-solid">
                  {doneCount}/{section.items.length}
                </span>
              </div>

              <div>
                {section.items.map((item) => {
                  const isChecked = Boolean(checkedMap[item.id]);
                  return (
                    <div key={item.id} className="checklist-row">
                      <button
                        type="button"
                        onClick={() => onToggle(item.id)}
                        className="checklist-row-btn">
                        <span
                          className={`checkbox-box ${
                            isChecked ? 'checked' : ''
                          }`}>
                          {isChecked && <Check size={14} strokeWidth={3} />}
                        </span>
                        <div>
                          <div
                            className={`checklist-label ${
                              isChecked ? 'checked' : ''
                            }`}>
                            {item.label}
                          </div>
                          {item.detail && (
                            <div
                              style={{
                                fontSize: 12.5,
                                color: 'var(--text-secondary)',
                                marginTop: 2,
                              }}>
                              {item.detail}
                            </div>
                          )}
                        </div>
                      </button>

                      {item.isCustom && onRemoveCustom && (
                        <button
                          type="button"
                          onClick={() => onRemoveCustom(item.id)}
                          aria-label={`Remove ${item.label}`}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            padding: '0 18px',
                            cursor: 'pointer',
                          }}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {allowCustomItems && onAddCustom && (
                <div
                  style={{
                    padding: '12px 20px',
                    background: 'var(--bg)',
                    borderTop: '1px solid var(--border)',
                  }}>
                  {addingTo === section.id ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder={`Add custom item to ${section.title}...`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveCustom(section.id);
                        }}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: 8,
                          border: '1px solid var(--primary-border)',
                          fontSize: 13.5,
                        }}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveCustom(section.id)}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: 13 }}>
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAddingTo(null);
                          setDraft('');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          fontSize: 13,
                          cursor: 'pointer',
                          padding: '0 8px',
                        }}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setAddingTo(section.id);
                        setDraft('');
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}>
                      <Plus size={15} />
                      <span>Add custom item to {section.title}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================
 * TYRE PRESSURE GUIDE WEB MODULE
 * ============================================================================ */
function WebTyrePressureModule({
  prefs,
  recommendation,
  onChangePrefs,
  onResetPrefs,
  onBack,
}: {
  prefs: BikePrepPersistedState['tyrePressure'];
  recommendation: ReturnType<typeof calculateTyrePressure>;
  onChangePrefs: (
    updates: Partial<BikePrepPersistedState['tyrePressure']>
  ) => void;
  onResetPrefs: () => void;
  onBack: () => void;
}) {
  const activeOption =
    BICYCLE_TYPE_OPTIONS.find((o) => o.type === prefs.bicycleType) ??
    BICYCLE_TYPE_OPTIONS[0];

  const handleSelectBikeType = (type: BicycleType) => {
    const opt =
      BICYCLE_TYPE_OPTIONS.find((o) => o.type === type) ??
      BICYCLE_TYPE_OPTIONS[0];
    onChangePrefs({
      bicycleType: type,
      tyreWidthMm: opt.defaultWidthMm,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}>
        <button
          type="button"
          onClick={onBack}
          className="region-toggle-btn"
          style={{ height: 40, padding: '0 16px' }}>
          <ArrowLeft size={16} />
          <span>Back to Bike Preparation</span>
        </button>

        <button
          type="button"
          onClick={onResetPrefs}
          className="region-toggle-btn"
          style={{ height: 40, padding: '0 16px' }}>
          <RotateCcw size={15} />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div>
        <div className="page-eyebrow">TYRE SETUP &amp; SURFACE CALCULATOR</div>
        <h1 className="page-title">Tyre Pressure Guide</h1>
        <p className="page-subtitle">
          Select your bicycle type, tyre width (mm), rider weight (kg), and
          riding conditions for an estimated starting pressure in PSI and BAR.
        </p>
      </div>

      {/* Pressure Output Banner */}
      <div className="prep-hero-banner">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
          }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: '#6EE7B7',
              letterSpacing: 0.8,
            }}>
            ESTIMATED STARTING PRESSURE
          </span>
          <span
            style={{
              background: 'rgba(255,255,255,0.14)',
              padding: '4px 12px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
            }}>
            {prefs.bicycleType} • {prefs.tyreWidthMm} mm • {prefs.riderWeightKg}{' '}
            kg • {prefs.condition}
          </span>
        </div>

        <div className="wheels-readout-grid">
          <div className="wheel-gauge-card">
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#A7F3D0',
                letterSpacing: 0.6,
              }}>
              FRONT WHEEL
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span className="psi-big">{recommendation.frontPsi}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#A7F3D0' }}>
                PSI
              </span>
            </div>
            <span className="bar-pill">
              {recommendation.frontBar.toFixed(2)} BAR
            </span>
          </div>

          <div className="wheel-gauge-card">
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#A7F3D0',
                letterSpacing: 0.6,
              }}>
              REAR WHEEL
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span className="psi-big">{recommendation.rearPsi}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#A7F3D0' }}>
                PSI
              </span>
            </div>
            <span className="bar-pill">
              {recommendation.rearBar.toFixed(2)} BAR
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.1)',
            padding: '10px 16px',
            borderRadius: 12,
            fontSize: 13,
          }}>
          <span>Balanced Midpoint Reference:</span>
          <strong>
            {recommendation.averagePsi} PSI /{' '}
            {recommendation.averageBar.toFixed(2)} BAR
          </strong>
        </div>
      </div>

      {/* Mandatory Safety Disclaimer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          background: 'var(--warm-surface)',
          border: '1px solid var(--warm-border)',
          borderRadius: 16,
          padding: 16,
          color: '#92400E',
        }}>
        <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 13, lineHeight: 1.55 }}>
          <strong style={{ display: 'block', marginBottom: 3 }}>
            Starting Recommendation Only — Check Sidewall &amp; Rim Limits
          </strong>
          These values are estimated starting recommendations based on typical
          casing volumes and load distribution, not universal manufacturer
          specifications. Always follow the maximum and minimum pressure ratings
          printed on your tyre sidewall and wheel rim manufacturer
          specifications.
        </div>
      </div>

      {/* Controls Grid */}
      <div className="prep-utilities-grid">
        {/* Step 1: Bicycle Type */}
        <div className="detail-card">
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>1. Bicycle Type</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {BICYCLE_TYPE_OPTIONS.map((opt) => {
              const active = prefs.bicycleType === opt.type;
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => handleSelectBikeType(opt.type)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: active
                      ? '2px solid var(--primary)'
                      : '1px solid var(--border)',
                    background: active ? 'var(--primary-surface)' : 'var(--bg)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}>
                  <div>
                    <div
                      style={{
                        fontSize: 14.5,
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                      }}>
                      {opt.type}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                      }}>
                      {opt.subtitle}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: 'var(--primary)',
                    }}>
                    {opt.minWidthMm}–{opt.maxWidthMm} mm
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Tyre Width & Rider Weight */}
        <div className="detail-card">
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>
            2. Tyre Width (mm) &amp; Rider Weight (kg)
          </h3>

          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 8,
              }}>
              <span>Tyre Width: {prefs.tyreWidthMm} mm</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  onClick={() =>
                    onChangePrefs({
                      tyreWidthMm: Math.max(
                        activeOption.minWidthMm,
                        prefs.tyreWidthMm - 1
                      ),
                    })
                  }
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    cursor: 'pointer',
                  }}>
                  <Minus size={14} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onChangePrefs({
                      tyreWidthMm: Math.min(
                        activeOption.maxWidthMm,
                        prefs.tyreWidthMm + 1
                      ),
                    })
                  }
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    cursor: 'pointer',
                  }}>
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {activeOption.widthPresetsMm.map((mm) => (
                <button
                  key={mm}
                  type="button"
                  onClick={() => onChangePrefs({ tyreWidthMm: mm })}
                  className={`category-chip ${
                    prefs.tyreWidthMm === mm ? 'active' : ''
                  }`}
                  style={{ padding: '6px 12px', fontSize: 12.5 }}>
                  {mm} mm
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 8,
              }}>
              <span>Rider Weight: {prefs.riderWeightKg} kg</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  onClick={() =>
                    onChangePrefs({
                      riderWeightKg: Math.max(40, prefs.riderWeightKg - 1),
                    })
                  }
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    cursor: 'pointer',
                  }}>
                  <Minus size={14} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onChangePrefs({
                      riderWeightKg: Math.min(140, prefs.riderWeightKg + 1),
                    })
                  }
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    cursor: 'pointer',
                  }}>
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[55, 65, 75, 85, 95, 105].map((kg) => (
                <button
                  key={kg}
                  type="button"
                  onClick={() => onChangePrefs({ riderWeightKg: kg })}
                  className={`category-chip ${
                    prefs.riderWeightKg === kg ? 'active' : ''
                  }`}
                  style={{ padding: '6px 12px', fontSize: 12.5 }}>
                  {kg} kg
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Riding Conditions & Tubeless */}
      <div className="detail-card">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}>
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>
            3. Riding Conditions &amp; Casing Setup
          </h3>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              onClick={() => onChangePrefs({ isTubeless: true })}
              className={`category-chip ${prefs.isTubeless ? 'active' : ''}`}
              style={{ padding: '6px 14px', fontSize: 12.5 }}>
              Tubeless
            </button>
            <button
              type="button"
              onClick={() => onChangePrefs({ isTubeless: false })}
              className={`category-chip ${!prefs.isTubeless ? 'active' : ''}`}
              style={{ padding: '6px 14px', fontSize: 12.5 }}>
              Inner Tube
            </button>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 12,
          }}>
          {RIDING_CONDITION_OPTIONS.map((item) => {
            const active = prefs.condition === item.condition;
            return (
              <button
                key={item.condition}
                type="button"
                onClick={() =>
                  onChangePrefs({ condition: item.condition as RidingCondition })
                }
                style={{
                  padding: 16,
                  borderRadius: 12,
                  border: active
                    ? '2px solid var(--primary)'
                    : '1px solid var(--border)',
                  background: active ? 'var(--primary-surface)' : 'var(--bg)',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}>
                  <strong style={{ fontSize: 15 }}>{item.condition}</strong>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: 'var(--primary)',
                    }}>
                    {item.adjustmentLabel}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 12.5,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}>
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * PRIVACY POLICY WEB SECTION
 * ============================================================================ */
function WebPrivacyPolicySection({
  onBackToEvents,
}: {
  onBackToEvents: () => void;
}) {
  const sections = [
    {
      title: '1. Overview & Commitment to Privacy',
      body: 'The Bicycle Logistics mobile application and web companion ("the Application") provide a South African Cycling Events Directory and an interactive Bike Preparation Assistant. We respect your privacy and have engineered the Application on a strict privacy-by-design, offline-first architecture. You can browse all cycling events, use the tyre pressure calculator, and manage all preparation checklists without creating an account or providing any personal information.',
    },
    {
      title: '2. Information We Do Not Collect',
      body: 'The Application does not collect, transmit, store on external servers, or sell any personally identifiable information (PII). No user registration, login, name, email address, or phone number is required to use the Application. No third-party advertising trackers, behavioral profiling SDKs, or payment processors are embedded in the Application.',
    },
    {
      title: '3. Local-Only Device & Browser Storage',
      body: 'When you use the Bike Preparation features—including the Bicycle Inspection Checklist, Tyre Pressure Guide, Packing Checklist (and any custom items you add), and Race Day Checklist—your progress and preferences are saved exclusively on your own device using local application storage (on Android and iOS) or browser localStorage (on Web). This data never leaves your device. You may clear or reset your checklist progress at any time using the "Reset" buttons inside each tool.',
    },
    {
      title: '4. Device Permissions',
      body: 'The mobile and web applications operate without requesting sensitive device permissions: no GPS or Location access, no Camera or Photo Library access, and no Contacts or Microphone access. Standard internet connectivity is used solely to load event imagery and open external websites when explicitly selected by you.',
    },
    {
      title: '5. External Websites & Transport Enquiries (bicyclelogistics.co.za)',
      body: 'The Application contains links to official third-party cycling event websites (such as Cape Town Cycle Tour, sani2c, Ride Joburg, and Wines2Whales) as well as our official bicycle transport portal at https://www.bicyclelogistics.co.za/. When you select "Official Event Website" or "Arrange Bicycle Transport", the link opens in your browser. Any personal details you voluntarily submit on https://www.bicyclelogistics.co.za/ when booking bicycle transport are governed by Bicycle Logistics’ official privacy and POPIA (Protection of Personal Information Act) policies.',
    },
    {
      title: '6. Children’s Privacy & General Audience Compliance',
      body: 'Because the Application does not collect, store, or transmit personal data from any user, it is safe for general audiences of all ages and complies with Google Play Families and Apple App Store data safety requirements.',
    },
    {
      title: '7. Updates to This Privacy Policy',
      body: 'If we introduce new optional features in future versions that affect how data is handled, we will update this Privacy Policy and revise the effective date displayed below.',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}>
        <button
          type="button"
          onClick={onBackToEvents}
          className="region-toggle-btn"
          style={{ height: 40, padding: '0 16px' }}>
          <ArrowLeft size={16} />
          <span>Back to Cycling Events</span>
        </button>

        <a
          href="/privacy"
          className="nav-external-cta"
          style={{ padding: '8px 14px', fontSize: 12.5 }}>
          <ExternalLink size={14} />
          <span>Direct Privacy Policy Link (/privacy)</span>
        </a>
      </div>

      <div>
        <div className="page-eyebrow">
          <ShieldCheck size={14} />
          <span>POPIA &amp; GOOGLE PLAY DATA SAFETY COMPLIANT</span>
        </div>
        <h1 className="page-title">Privacy Policy</h1>
        <p className="page-subtitle">
          Effective Date: 15 November 2026 • Bicycle Logistics Mobile App &amp;
          Web Platform
        </p>
      </div>

      {/* Privacy Highlights Banner */}
      <div className="prep-hero-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
            <Lock size={22} color="#6EE7B7" />
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#6EE7B7',
                letterSpacing: 0.7,
              }}>
              PRIVACY AT A GLANCE
            </div>
            <h2 style={{ fontSize: 21, fontWeight: 800, marginTop: 2 }}>
              Zero Personal Data Collected. 100% Local Checklist Storage.
            </h2>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
            background: 'rgba(13, 46, 28, 0.55)',
            padding: 16,
            borderRadius: 14,
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle2 size={17} color="#6EE7B7" />
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              No registration or login required
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Database size={17} color="#6EE7B7" />
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              Checklists saved locally on your device
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Smartphone size={17} color="#6EE7B7" />
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              No GPS, camera, or contacts permissions
            </span>
          </div>
        </div>
      </div>

      {/* Policy Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {sections.map((sec) => (
          <article key={sec.title} className="detail-card">
            <h3 style={{ fontSize: 17, fontWeight: 800 }}>{sec.title}</h3>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
              }}>
              {sec.body}
            </p>
          </article>
        ))}
      </div>

      {/* Contact Block */}
      <div className="logistics-highlight-card">
        <h3 style={{ fontSize: 18, fontWeight: 800 }}>
          8. Contact Us &amp; Official Enquiries
        </h3>
        <p
          style={{
            fontSize: 14,
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}>
          If you have any questions about this Privacy Policy or our nationwide
          bicycle transport services across South Africa, please contact Bicycle
          Logistics:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <a
            href={OFFICIAL_BICYCLE_LOGISTICS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary">
            <Globe size={16} />
            <span>https://www.bicyclelogistics.co.za/</span>
            <ArrowUpRight size={16} />
          </a>
          <a
            href="mailto:bookings@bicyclelogistics.co.za"
            className="nav-external-cta">
            <Mail size={16} />
            <span>bookings@bicyclelogistics.co.za</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * DOWNLOAD APP & MORE INFO MODAL
 * ============================================================================ */
function DownloadAppModal({
  onClose,
  onOpenPrivacy,
}: {
  onClose: () => void;
  onOpenPrivacy: () => void;
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="detail-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Download Bicycle Logistics Mobile App">
        <div
          style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
            color: '#ffffff',
            padding: '26px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img
                src="/icon.png"
                alt="Bicycle Logistics App Icon"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    color: '#6EE7B7',
                    letterSpacing: 0.8,
                  }}>
                  OFFICIAL MOBILE COMPANION • V1.0
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800 }}>
                  Download Bicycle Logistics
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close download modal"
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                border: 'none',
                background: 'rgba(255,255,255,0.16)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}>
              <X size={18} />
            </button>
          </div>

          <p style={{ fontSize: 14, color: '#D1E7DB', lineHeight: 1.6 }}>
            Take South Africa’s Cycling Events Directory, Bicycle Inspection,
            Packing &amp; Race Day Checklists, and Tyre Pressure Guide with you
            to every start chute — works 100% offline with zero registration or
            tracking.
          </p>
        </div>

        <div className="detail-body">
          {/* Platform Download Options */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 14,
            }}>
            <div className="detail-card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <span className="badge-category-solid">ANDROID</span>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                  }}>
                  Android 8.0+
                </span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800 }}>
                Google Play Store
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Optimized for all Android phones &amp; tablets with local
                device persistence and zero location/camera permissions.
              </p>
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ marginTop: 4 }}>
                <Download size={16} />
                <span>Get on Google Play</span>
                <ArrowUpRight size={15} />
              </a>
            </div>

            <div className="detail-card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <span className="badge-category-solid">IOS</span>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                  }}>
                  iOS 15.0+
                </span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800 }}>Apple App Store</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Smooth native iPhone experience with safe-area support,
                interactive checklists, and quick links to{' '}
                <strong>bicyclelogistics.co.za</strong>.
              </p>
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ marginTop: 4 }}>
                <Download size={16} />
                <span>Download on App Store</span>
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

          {/* More Info Highlights */}
          <div className="detail-card">
            <h3 style={{ fontSize: 16.5, fontWeight: 800 }}>
              More Info: What’s Included in the App
            </h3>
            <div className="services-checklist">
              <div className="service-item">
                <CheckCircle2 size={16} color="#14432A" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>
                  <strong>SA Cycling Events Directory:</strong> Browse Cape Town
                  Cycle Tour, sani2c, Trans Baviaans, The 947 Ride Joburg,
                  Wines2Whales, Amashova, and IRONMAN South Africa with direct
                  transport logistics info.
                </span>
              </div>
              <div className="service-item">
                <CheckCircle2 size={16} color="#14432A" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>
                  <strong>4-Part Bike Preparation Suite:</strong> Interactive
                  Bicycle Inspection (16 checks), Tyre Pressure Guide (PSI &amp;
                  BAR), customizable Packing Checklist, and Race Day Timeline.
                </span>
              </div>
              <div className="service-item">
                <CheckCircle2 size={16} color="#14432A" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>
                  <strong>Built for Race Villages:</strong> All checklists and
                  pressure settings save locally on your device so you never lose
                  progress even without mobile reception.
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10,
                paddingTop: 10,
                borderTop: '1px solid var(--border)',
              }}>
              <button
                type="button"
                onClick={onOpenPrivacy}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}>
                <ShieldCheck size={15} />
                <span>Read Privacy Policy (/privacy)</span>
              </button>

              <a
                href={OFFICIAL_BICYCLE_LOGISTICS_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'var(--primary)',
                  fontSize: 13,
                  fontWeight: 700,
                }}>
                <Truck size={15} />
                <span>Book Bike Transport on bicyclelogistics.co.za</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
