<template>
  <div class="provider-visits-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-group">
          <h1 class="main-title">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Provider Visits Management
          </h1>
          <p class="subtitle">Schedule, track, and manage healthcare provider facility visits and inspections</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-number">{{ totalVisits }}</div>
            <div class="stat-label">Total Visits</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ scheduledVisits }}</div>
            <div class="stat-label">Scheduled</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ completedVisits }}</div>
            <div class="stat-label">Completed</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="content-section">
      <div class="content-header">
        <div class="search-section">
          <div class="search-wrapper">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              v-model="searchTerm" 
              placeholder="Search by meeting title..." 
              class="search-input"
            >
          </div>
        </div>
        <div class="filter-section">
          <div class="select-wrapper">
            <select v-model="providerFilter" class="modern-select" @change="loadVisitMeetings">
              <option value="">All Providers</option>
              <option v-for="provider in providers" :key="provider.id" :value="provider.id">
                {{ provider.providerName }}
              </option>
            </select>
            <svg class="select-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div class="date-filter">
            <div class="date-input-group">
              <label>From:</label>
              <input type="date" v-model="startDate" class="modern-input date-input" @change="loadVisitMeetings">
            </div>
            <div class="date-input-group">
              <label>To:</label>
              <input type="date" v-model="endDate" class="modern-input date-input" @change="loadVisitMeetings">
            </div>
          </div>
        </div>
      </div>

      <!-- Visits Container -->
      <div class="table-container">
        <div class="table-header">
          <h2 class="table-title">
            <svg class="table-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Visit Meetings
          </h2>
          <div class="action-buttons">
            <button class="primary-btn" @click="openCreateModal">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Schedule New Visit
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading visit meetings...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3>Error Loading Visits</h3>
          <p>{{ error }}</p>
          <button @click="loadVisitMeetings" class="retry-btn">Retry</button>
        </div>

        <!-- Table View (List) -->
        <div class="table-wrapper">
          <table class="visits-table">
            <thead>
              <tr>
                <th class="th-meeting-id">Meeting ID</th>
                <th class="th-provider">Provider</th>
                <th class="th-title">Meeting Title</th>
                <th class="th-date">Visit Date</th>
                <th class="th-meeting-date">Meeting Date</th>
                <th class="th-venue">Venue</th>
                <th class="th-status">Status</th>
                <th class="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="visit in visitMeetings" :key="visit.id">
                <tr class="visit-row" :class="{ 'selected': selectedVisit && selectedVisit.id === visit.id }">
                  <td class="td-meeting-id">
                    <span class="meeting-id-badge">{{ visit.id }}</span>
                  </td>
                  <td class="td-provider">
                    <div class="provider-cell">
                      <h4 class="provider-name">{{ visit.providerRequestDetails?.providerName || 'Unknown Provider' }}</h4>
                      <p class="provider-category">{{ visit.providerRequestDetails?.category || 'N/A' }}</p>
                    </div>
                  </td>
                  <td class="td-title">
                    <span class="meeting-title">{{ visit.meetingTitle || 'No Title' }}</span>
                  </td>
                  <td class="td-date">
                    <span class="visit-date">{{ formatDate(visit.visitDate) }}</span>
                  </td>
                  <td class="td-meeting-date">
                    <span class="meeting-date">{{ formatDate(visit.meetingDate) }}</span>
                  </td>
                  <td class="td-venue">
                    <span class="venue-name">{{ visit.venue || 'Not Specified' }}</span>
                  </td>
                  <td class="td-status">
                    <span class="status-badge" :class="getStatusClass(visit.status)">{{ visit.status || 'Scheduled' }}</span>
                  </td>
                  <td class="td-actions">
                    <div class="action-buttons">
                      <button class="action-btn view" @click="viewDetails(visit)" :class="{ 'active': selectedVisit && selectedVisit.id === visit.id }" title="View Details">
                        <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button class="action-btn edit" @click="editVisit(visit)" title="Edit Visit">
                        <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <!-- Inline Details Row -->
                <tr v-if="selectedVisit && selectedVisit.id === visit.id" class="details-row">
                  <td colspan="8" class="details-cell">
                    <div class="inline-details">
                      <div class="inline-details-header">
                        <h4 class="inline-details-title">{{ editingVisitId === visit.id ? 'Edit Visit Meeting' : 'Visit Details' }}</h4>
                        <button class="close-details" @click="editingVisitId === visit.id ? cancelEdit() : selectedVisit = null">×</button>
                      </div>

                      <!-- View Mode -->
                      <div v-if="editingVisitId !== visit.id" class="inline-details-content">
                        <div class="detail-grid">
                          <div class="detail-section">
                            <h4 class="section-title">Visit Information</h4>
                            <div class="detail-item">
                              <label class="detail-label">Provider</label>
                              <span class="detail-value">{{ visit.providerRequestDetails?.providerName || 'Unknown Provider' }}</span>
                            </div>
                            <div class="detail-item">
                              <label class="detail-label">Visit Date</label>
                              <span class="detail-value">{{ formatDate(visit.visitDate) }}</span>
                            </div>
                            <div class="detail-item">
                              <label class="detail-label">Status</label>
                              <span class="status-badge modern" :class="getStatusClass(visit.status)">
                                {{ visit.status || 'Pending' }}
                              </span>
                            </div>
                            <div class="detail-item">
                              <label class="detail-label">Visit Comments</label>
                              <span class="detail-value">{{ visit.visitComments || 'No comments' }}</span>
                            </div>
                          </div>

                          <div class="detail-section">
                            <h4 class="section-title">Meeting Details</h4>
                            <div class="detail-item">
                              <label class="detail-label">Meeting Title</label>
                              <span class="detail-value">{{ visit.meetingTitle || 'No title' }}</span>
                            </div>
                            <div class="detail-item">
                              <label class="detail-label">Venue</label>
                              <span class="detail-value">{{ visit.venue || 'No venue specified' }}</span>
                            </div>
                            <div class="detail-item">
                              <label class="detail-label">Meeting Date</label>
                              <span class="detail-value">{{ formatDate(visit.meetingDate) || 'Not set' }}</span>
                            </div>
                            <div class="detail-item">
                              <label class="detail-label">Meeting Comments</label>
                              <span class="detail-value">{{ visit.meetingComments || 'No comments' }}</span>
                            </div>
                          </div>

                          <div class="detail-section">
                            <h4 class="section-title">Documentation</h4>
                            <div class="detail-item">
                              <label class="detail-label">Meeting Minutes</label>
                              <div class="detail-value meeting-minutes">{{ visit.meetingMinutes || 'No minutes recorded' }}</div>
                            </div>
                            <div class="detail-item">
                              <label class="detail-label">Visit Report</label>
                              <div class="detail-value visit-report">{{ visit.visitReport || 'No report available' }}</div>
                            </div>
                          </div>
                        </div>

                        <div class="inline-actions">
                          <button @click="editVisit(visit)" class="btn-compact btn-edit">
                            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Visit
                          </button>
                          <button @click="confirmDelete(visit)" class="btn-compact btn-delete">
                            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>

                      <!-- Edit Mode - Beautiful Design -->
                      <div v-else class="inline-edit-beautiful">
                        <form @submit.prevent="saveInlineEdit" class="compact-edit-form">
                          <!-- Primary Fields Row -->
                          <div class="compact-row primary-fields">
                            <div class="compact-field">
                              <label class="compact-label">Provider Request <span class="required">*</span></label>
                              <div class="provider-search-compact">
                                <input 
                                  type="text" 
                                  v-model="providerSearchTerm" 
                                  @input="searchProviders(providerSearchTerm)"
                                  @focus="showProviderResults = true"
                                  required 
                                  disabled
                                  class="compact-input disabled"
                                  :placeholder="selectedProvider ? selectedProvider.providerName : 'Provider locked in edit mode'"
                                >
                                <div v-if="showProviderResults && providerSearchTerm && filteredProviders.length > 0" class="search-results compact-dropdown">
                                  <div 
                                    v-for="provider in filteredProviders" 
                                    :key="provider.id" 
                                    class="search-result-item"
                                    @click="selectProvider(provider)"
                                  >
                                    {{ provider.providerName }}
                                  </div>
                                </div>
                                <div v-else-if="showProviderResults && providerSearchTerm && providerSearchTerm.length >= 2 && filteredProviders.length === 0" class="search-results compact-dropdown">
                                  <div class="search-result-item no-results">No providers found</div>
                                </div>
                              </div>
                            </div>
                            <div class="compact-field">
                              <label class="compact-label">Visit Date <span class="required">*</span></label>
                              <input type="date" v-model="visitForm.visitDate" required class="compact-input">
                            </div>
                            <div class="compact-field">
                              <label class="compact-label">Status</label>
                              <select v-model="visitForm.status" class="compact-input compact-select">
                                <option value="Scheduled">Scheduled</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Postponed">Postponed</option>
                              </select>
                            </div>
                          </div>

                          <!-- Secondary Fields Row -->
                          <div class="compact-row secondary-fields">
                            <div class="compact-field">
                              <label class="compact-label">Meeting Title</label>
                              <input type="text" v-model="visitForm.meetingTitle" class="compact-input" placeholder="Meeting title">
                            </div>
                            <div class="compact-field">
                              <label class="compact-label">Meeting Date</label>
                              <input type="date" v-model="visitForm.meetingDate" class="compact-input">
                            </div>
                            <div class="compact-field">
                              <label class="compact-label">Venue</label>
                              <div class="venue-search-compact">
                                <input 
                                  type="text" 
                                  v-model="venueSearchTerm" 
                                  @input="searchVenues(venueSearchTerm)"
                                  @focus="showVenueResults = true"
                                  class="compact-input"
                                  placeholder="Search venue/location..."
                                >
                                <div v-if="showVenueResults && venueSearchTerm && filteredVenues.length > 0" class="search-results compact-dropdown">
                                  <div 
                                    v-for="venue in filteredVenues" 
                                    :key="venue.entityId" 
                                    class="search-result-item"
                                    @click="selectVenue(venue)"
                                  >
                                    {{ venue.companyName || `${venue.firstName} ${venue.surname}`.trim() }}
                                  </div>
                                </div>
                                <div v-else-if="showVenueResults && venueSearchTerm && venueSearchTerm.length >= 2 && filteredVenues.length === 0" class="search-results compact-dropdown">
                                  <div class="search-result-item no-results">No venues found</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Comments Row - Collapsible -->
                          <div class="compact-row comments-section">
                            <div class="comments-toggle" @click="showCommentsInline = !showCommentsInline">
                              <span class="toggle-label">Comments & Reports</span>
                              <svg class="toggle-icon" :class="{ 'rotated': showCommentsInline }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                            <div v-show="showCommentsInline" class="comments-grid">
                              <div class="compact-field">
                                <label class="compact-label">Visit Comments</label>
                                <textarea v-model="visitForm.visitComments" class="compact-textarea" placeholder="Visit comments..." rows="2"></textarea>
                              </div>
                              <div class="compact-field">
                                <label class="compact-label">Meeting Comments</label>
                                <textarea v-model="visitForm.meetingComments" class="compact-textarea" placeholder="Meeting comments..." rows="2"></textarea>
                              </div>
                              <div class="compact-field">
                                <label class="compact-label">Visit Report</label>
                                <textarea v-model="visitForm.visitReport" class="compact-textarea" placeholder="Visit report..." rows="2"></textarea>
                              </div>
                              <div class="compact-field">
                                <label class="compact-label">Meeting Minutes</label>
                                <textarea v-model="visitForm.meetingMinutes" class="compact-textarea" placeholder="Meeting minutes..." rows="2"></textarea>
                              </div>
                            </div>
                          </div>

                          <!-- Action Buttons -->
                          <div class="compact-actions">
                            <button type="button" class="btn-compact btn-secondary" @click="cancelEdit">
                              <svg class="icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Cancel
                            </button>
                            <button type="submit" class="btn-compact btn-primary">
                              <svg class="icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Update
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>


        <!-- Empty State -->
        <div v-if="!loading && !error && visitMeetings.length === 0" class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3>No Visit Meetings Found</h3>
          <p>No visit meetings match your current filters or search criteria.</p>
          <button @click="resetFilters" class="primary-btn">Reset Filters</button>
        </div>

        <!-- Pagination -->
        <div v-if="!loading && !error && totalPages > 1" class="pagination-section">
          <div class="pagination-info">
            <span>Page {{ currentPage + 1 }} of {{ totalPages }} ({{ totalElements }} total visits)</span>
          </div>
          <div class="pagination-controls">
            <button @click="prevPage" :disabled="currentPage === 0" class="pagination-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div class="page-numbers">
              <button 
                v-for="page in Math.min(5, totalPages)" 
                :key="page - 1"
                @click="goToPage(page - 1)"
                :class="{ active: currentPage === page - 1 }"
                class="page-number"
              >
                {{ page }}
              </button>
            </div>

            <button @click="nextPage" :disabled="currentPage >= totalPages - 1" class="pagination-btn">
              Next
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Visit Modal -->
    <div v-if="visitModal.show" class="modal-overlay" @click="closeVisitModal">
      <div class="visit-modal enterprise-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ visitModal.isEdit ? 'Edit Visit Meeting' : 'Schedule New Visit Meeting' }}</h3>
          <button class="modal-close" @click="closeVisitModal">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveVisitMeeting" class="modern-form enterprise-form compact-visit-form">

            <!-- Beautiful Form Layout -->
            <div class="beautiful-form-layout">
              <!-- Primary Information Row -->
              <div class="form-section">
                <div class="form-row compact-grid">
                  <div class="input-group">
                    <label class="input-label">Provider <span class="required">*</span></label>
                    <div class="input-wrapper provider-search">
                      <input 
                        type="text" 
                        v-model="providerSearchTerm" 
                        @input="searchProviders(providerSearchTerm)"
                        @focus="showProviderResults = true"
                        required 
                        class="modern-input compact-input"
                        placeholder="Search provider..."
                        :disabled="visitModal.isEdit"
                      >
                      <div v-if="!visitModal.isEdit && showProviderResults && providerSearchTerm && filteredProviders.length > 0" class="search-results">
                        <div 
                          v-for="provider in filteredProviders" 
                          :key="provider.id" 
                          class="search-result-item"
                          @click="selectProvider(provider)"
                        >
                          {{ provider.providerName || provider.name }}
                        </div>
                      </div>
                      <div v-else-if="!visitModal.isEdit && showProviderResults && providerSearchTerm && providerSearchTerm.length >= 2 && filteredProviders.length === 0" class="search-results">
                        <div class="search-result-item no-results">No providers found</div>
                      </div>
                    </div>
                  </div>
                  <div class="input-group">
                    <label class="input-label">Visit Date <span class="required">*</span></label>
                    <input type="date" v-model="visitForm.visitDate" required class="modern-input compact-input date-input">
                  </div>
                  <div class="input-group">
                    <label class="input-label">Meeting Date</label>
                    <input type="date" v-model="visitForm.meetingDate" class="modern-input compact-input date-input">
                  </div>
                </div>
              </div>

              <!-- Secondary Information Row -->
              <div class="form-section">
                <div class="form-row compact-grid">
                  <div class="input-group">
                    <label class="input-label">Meeting Title</label>
                    <input type="text" v-model="visitForm.meetingTitle" class="modern-input compact-input" placeholder="Enter title">
                  </div>
                  <div class="input-group">
                    <label class="input-label">Venue</label>
                    <div class="input-wrapper venue-search">
                      <input 
                        type="text" 
                        v-model="venueSearchTerm" 
                        @input="searchVenues(venueSearchTerm)"
                        @focus="showVenueResults = true"
                        class="modern-input compact-input"
                        placeholder="Search venue..."
                      >
                      <div v-if="showVenueResults && venueSearchTerm && filteredVenues.length > 0" class="search-results">
                        <div 
                          v-for="venue in filteredVenues" 
                          :key="venue.id" 
                          class="search-result-item"
                          @click="selectVenue(venue)"
                        >
                          {{ venue.name }}
                        </div>
                      </div>
                      <div v-else-if="showVenueResults && venueSearchTerm && venueSearchTerm.length >= 2 && filteredVenues.length === 0" class="search-results">
                        <div class="search-result-item no-results">No venues found</div>
                      </div>
                    </div>
                    <div v-if="selectedVenue" class="selected-item compact-selected">
                      <span>{{ selectedVenue.name }}</span>
                      <button type="button" class="clear-selection" @click="selectedVenue = null; visitForm.venue = ''; venueSearchTerm = ''">×</button>
                    </div>
                  </div>
                  <div class="input-group">
                    <label class="input-label">Status</label>
                    <select v-model="visitForm.status" class="modern-input compact-input modern-select">
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Postponed">Postponed</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Comments Section - Collapsible -->
              <div class="form-section">
                <div class="comments-toggle" @click="showComments = !showComments">
                  <span class="toggle-label">Additional Details</span>
                  <svg class="toggle-icon" :class="{ 'rotated': showComments }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div v-show="showComments" class="comments-grid">
                  <div class="compact-field">
                    <label class="compact-label">Visit Comments</label>
                    <textarea v-model="visitForm.visitComments" class="compact-textarea" placeholder="Visit comments..." rows="2"></textarea>
                  </div>
                  <div class="compact-field">
                    <label class="compact-label">Meeting Comments</label>
                    <textarea v-model="visitForm.meetingComments" class="compact-textarea" placeholder="Meeting comments..." rows="2"></textarea>
                  </div>
                  <div class="compact-field">
                    <label class="compact-label">Visit Report</label>
                    <textarea v-model="visitForm.visitReport" class="compact-textarea" placeholder="Visit report..." rows="2"></textarea>
                  </div>
                  <div class="compact-field">
                    <label class="compact-label">Meeting Minutes</label>
                    <textarea v-model="visitForm.meetingMinutes" class="compact-textarea" placeholder="Meeting minutes..." rows="2"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="secondary-btn" @click="closeVisitModal">Cancel</button>
              <button type="submit" class="primary-btn">{{ visitModal.isEdit ? 'Update Visit' : 'Schedule Visit' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Venue Confirmation Modal -->
    <div v-if="showVenueConfirmation" class="modal-overlay" @click="cancelVenueSelection">
      <div class="confirmation-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Confirm Venue Selection</h3>
          <button class="modal-close" @click="cancelVenueSelection">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to select the following venue?</p>
          <div class="venue-details" v-if="selectedVenue">
            <div class="venue-detail-item">
              <label>Name:</label>
              <span>{{ selectedVenue.name }}</span>
            </div>
            <div class="venue-detail-item">
              <label>Category:</label>
              <span>{{ selectedVenue.category }}</span>
            </div>
            <div class="venue-detail-item">
              <label>Location:</label>
              <span>{{ selectedVenue.location }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="secondary-btn" @click="cancelVenueSelection">Cancel</button>
          <button type="button" class="primary-btn" @click="confirmVenue">Confirm Venue</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteModal.show" class="modal-overlay" @click="closeDeleteModal">
      <div class="delete-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Confirm Delete</h3>
          <button class="modal-close" @click="closeDeleteModal">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this visit meeting?</p>
          <p v-if="deleteModal.visit">
            <strong>Provider:</strong> {{ deleteModal.visit.providerRequestDetails?.providerName || 'Unknown Provider' }}<br>
            <strong>Meeting Title:</strong> {{ deleteModal.visit.meetingTitle || 'No Title' }}<br>
            <strong>Visit Date:</strong> {{ formatDate(deleteModal.visit.visitDate) }}
          </p>
          <p class="warning-text">This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="closeDeleteModal">Cancel</button>
          <button class="danger-btn" @click="deleteVisitMeeting">Delete</button>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="showToast" class="toast success-toast">
      <svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div class="toast-content">
        <h4>Success!</h4>
        <p>{{ toastMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ProviderAPIService, transformProviderData } from '@/services/api'

// State variables
const visitMeetings = ref([])
const providers = ref([])
const loading = ref(false)
const error = ref(null)
const selectedVisit = ref(null)
const editingVisitId = ref(null) // Track which visit is being edited inline
const showToast = ref(false)
const toastMessage = ref('')

// Provider search state
const providerSearchTerm = ref('') // For searching providers by name
const filteredProviders = ref([]) // Filtered providers based on search
const selectedProvider = ref(null) // Selected provider for the form
const showProviderResults = ref(false) // Flag to show/hide provider search results

// Venue search state
const venueSearchTerm = ref('') // For searching venues by name
const filteredVenues = ref([]) // Filtered venues based on search
const selectedVenue = ref(null) // Selected venue for the form
const showVenueResults = ref(false) // Flag to show/hide venue search results
const showVenueConfirmation = ref(false) // Flag to show/hide venue confirmation dialog
const venueToConfirm = ref(null) // Venue to confirm

// Pagination
const currentPage = ref(0)
const pageSize = ref(10)
const totalPages = ref(0)
const totalElements = ref(0)

// Filters
const searchTerm = ref('')
const providerFilter = ref('')
const startDate = ref('')
const endDate = ref('')

// Modal states
const visitModal = ref({
  show: false,
  isEdit: false,
  visit: null
})

const deleteModal = ref({
  show: false,
  visit: null
})

// Active tab for the visit form
const activeTab = ref('basic')

// Comments section visibility
const showComments = ref(false)

// Inline comments section visibility
const showCommentsInline = ref(false)

// Form state
const visitForm = ref({
  providerId: '',
  visitDate: '',
  visitComments: '',
  visitReport: '',
  meetingTitle: '',
  meetingDate: '',
  meetingComments: '',
  meetingMinutes: '',
  venue: '',
  status: 'Scheduled' // Default status
})

// Computed properties
const totalVisits = computed(() => totalElements.value)

const scheduledVisits = computed(() => {
  // Count visits with future dates
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return visitMeetings.value.filter(visit => {
    const visitDate = new Date(visit.visitDate)
    return visitDate >= today
  }).length
})

const completedVisits = computed(() => {
  // Count visits with past dates
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return visitMeetings.value.filter(visit => {
    const visitDate = new Date(visit.visitDate)
    return visitDate < today
  }).length
})

// Load visit meetings from API
const loadVisitMeetings = async () => {
  loading.value = true
  error.value = null

  try {
    let response

    // If search term is provided, search by title
    if (searchTerm.value.trim()) {
      response = await ProviderAPIService.searchVisitMeetingsByTitle(searchTerm.value, {
        page: currentPage.value,
        size: pageSize.value
      })
    }
    // If provider filter is applied, get visits for that provider
    else if (providerFilter.value) {
      response = await ProviderAPIService.getVisitMeetingsByProviderId(providerFilter.value, {
        page: currentPage.value,
        size: pageSize.value
      })
    }
    // If date range is provided, filter by date range
    else if (startDate.value && endDate.value) {
      response = await ProviderAPIService.getVisitMeetingsByDateRange(startDate.value, endDate.value, {
        page: currentPage.value,
        size: pageSize.value
      })
    }
    // Otherwise, get all visits with pagination
    else {
      response = await ProviderAPIService.getVisitMeetings({
        page: currentPage.value,
        size: pageSize.value,
        sortBy: 'visitDate',
        sortDir: 'desc'
      })
    }

    visitMeetings.value = response.content || []
    totalPages.value = response.totalPages || 1
    totalElements.value = response.totalElements || visitMeetings.value.length
  } catch (err) {
    error.value = err.message
    console.error('Error loading visit meetings:', err)

    // Fallback to empty array
    visitMeetings.value = []
    totalElements.value = 0
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

// Load providers for dropdown or search
const loadProviders = async (searchTerm = '') => {
  try {
    let response;

    if (searchTerm.trim()) {
      // Search providers by name
      response = await ProviderAPIService.getProviderRequests({
        page: 0,
        size: 20,
        providerName: searchTerm
      });

      filteredProviders.value = response.content || [];
    } else {
      // Load initial providers (limited to avoid performance issues)
      response = await ProviderAPIService.getProviderRequests({
        page: 0,
        size: 20
      });

      providers.value = response.content || [];
      filteredProviders.value = providers.value;
    }
  } catch (err) {
    console.error('Error loading providers:', err);
    providers.value = [];
    filteredProviders.value = [];
  }
}

// Handle provider search
const searchProviders = (searchTerm) => {
  providerSearchTerm.value = searchTerm;
  showProviderResults.value = true;
  if (searchTerm.trim().length >= 2) {
    loadProviders(searchTerm);
  } else if (searchTerm.trim().length === 0) {
    loadProviders();
  }
}

// Select provider for the form
const selectProvider = (provider) => {
  selectedProvider.value = provider;
  visitForm.value.providerId = provider.id;
  providerSearchTerm.value = provider.providerName || provider.name;
  showProviderResults.value = false; // Hide dropdown after selection
}

// Clear provider selection
const clearProviderSelection = () => {
  selectedProvider.value = null;
  visitForm.value.providerId = '';
  providerSearchTerm.value = '';
  showProviderResults.value = false;
}

// Handle venue search
const searchVenues = (searchTerm) => {
  venueSearchTerm.value = searchTerm;
  showVenueResults.value = true;
  if (searchTerm.trim().length >= 2) {
    loadVenues(searchTerm);
  } else if (searchTerm.trim().length === 0) {
    filteredVenues.value = [];
  }
}

// Load venues from API
const loadVenues = async (searchTerm = '') => {
  try {
    let response;

    if (searchTerm.trim()) {
      // Search venues by company name using the new API endpoint
      response = await ProviderAPIService.searchVenues(searchTerm, {
        page: 0,
        size: 10,
        sortBy: 'companyName',
        sortDir: 'asc'
      });

      if (response.status === 0 && response.content) {
        const transformedVenues = response.content.content.map(entity => transformProviderData(entity));
        filteredVenues.value = transformedVenues;
      } else {
        filteredVenues.value = [];
      }
    } else {
      filteredVenues.value = [];
    }
  } catch (err) {
    console.error('Error loading venues:', err);
    filteredVenues.value = [];
  }
}

// Select venue for confirmation
const selectVenue = (venue) => {
  // For inline edit form, directly set venue
  selectedVenue.value = venue;
  visitForm.value.venue = venue.companyName || `${venue.firstName} ${venue.surname}`.trim();
  venueSearchTerm.value = venue.companyName || `${venue.firstName} ${venue.surname}`.trim();
  showVenueResults.value = false; // Hide dropdown after selection
}

// Confirm venue selection
const confirmVenue = () => {
  selectedVenue.value = venueToConfirm.value;
  visitForm.value.venue = venueToConfirm.value.id.toString(); // Store venue ID as string
  showVenueConfirmation.value = false;
  venueToConfirm.value = null;
}

// Clear venue selection
const clearVenueSelection = () => {
  selectedVenue.value = null;
  visitForm.value.venue = '';
  venueSearchTerm.value = '';
  showVenueResults.value = false;
}

// Cancel venue selection
const cancelVenueSelection = () => {
  showVenueConfirmation.value = false;
  venueToConfirm.value = null;
  // If no venue was previously selected, clear the search term
  if (!selectedVenue.value) {
    venueSearchTerm.value = '';
  } else {
    // Restore the previous selection
    venueSearchTerm.value = selectedVenue.value.name;
  }
}

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

// Get CSS class for status badge
const getStatusClass = (status) => {
  switch (status) {
    case 'Scheduled':
      return 'status-scheduled'
    case 'In Progress':
      return 'status-in-progress'
    case 'Completed':
      return 'status-completed'
    case 'Cancelled':
      return 'status-cancelled'
    case 'Postponed':
      return 'status-postponed'
    default:
      return 'status-scheduled'
  }
}

// Reset all filters
const resetFilters = () => {
  searchTerm.value = ''
  providerFilter.value = ''
  startDate.value = ''
  endDate.value = ''
  currentPage.value = 0
  loadVisitMeetings()
}

// Pagination methods
const goToPage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
    loadVisitMeetings()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    goToPage(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 0) {
    goToPage(currentPage.value - 1)
  }
}

// View visit details
const viewDetails = (visit) => {
  if (selectedVisit.value && selectedVisit.value.id === visit.id) {
    // Close details if already open
    selectedVisit.value = null
    editingVisitId.value = null // Clear any editing state
  } else {
    // Open details
    selectedVisit.value = visit
    editingVisitId.value = null // Ensure we're in view mode, not edit mode
  }
}

// Open create modal
const openCreateModal = () => {
  // Reset form
  visitForm.value = {
    providerId: '',
    visitDate: '',
    visitComments: '',
    visitReport: '',
    meetingTitle: '',
    meetingDate: '',
    meetingComments: '',
    meetingMinutes: '',
    venue: ''
  }

  // Reset provider search state
  providerSearchTerm.value = '';
  selectedProvider.value = null;
  filteredProviders.value = [];
  showProviderResults.value = false;

  // Reset venue search state
  venueSearchTerm.value = '';
  selectedVenue.value = null;
  filteredVenues.value = [];
  showVenueResults.value = false;
  showVenueConfirmation.value = false;
  venueToConfirm.value = null;

  // Load initial providers
  loadProviders();

  // Reset active tab to basic info
  activeTab.value = 'basic';

  visitModal.value = {
    show: true,
    isEdit: false,
    visit: null
  }
}

// Edit visit (inline or modal)
const editVisit = (visit, useModal = false) => {
  if (useModal) {
    // Use modal for editing
    // Populate form with visit data
    visitForm.value = {
      providerId: visit.providerId || '',
      visitDate: visit.visitDate || '',
      visitComments: visit.visitComments || '',
      visitReport: visit.visitReport || '',
      meetingTitle: visit.meetingTitle || '',
      meetingDate: visit.meetingDate || '',
      meetingComments: visit.meetingComments || '',
      meetingMinutes: visit.meetingMinutes || '',
      venue: visit.venue || '',
      status: visit.status || 'Scheduled' // Default to 'Scheduled' if no status is provided
    }

    // Set provider search state based on the selected visit
    setProviderSearchState(visit);

    // Set venue search state if venue is available
    setVenueSearchState(visit);

    // Reset active tab to basic info
    activeTab.value = 'basic';

    // Show the modal in edit mode
    visitModal.value = {
      show: true,
      isEdit: true,
      visit: visit
    }
  } else {
    // Use inline editing
    // Check if we're already editing this visit
    if (editingVisitId.value === visit.id) {
      // Toggle off edit mode - go back to view mode
      editingVisitId.value = null;
      return;
    }

    // Clear any existing editing state first
    editingVisitId.value = null;

    // Ensure the visit details are visible
    selectedVisit.value = visit;

    // Set the editing visit ID to enable inline editing
    editingVisitId.value = visit.id;

    // Populate form with visit data
    visitForm.value = {
      providerId: visit.providerId || '',
      visitDate: visit.visitDate || '',
      visitComments: visit.visitComments || '',
      visitReport: visit.visitReport || '',
      meetingTitle: visit.meetingTitle || '',
      meetingDate: visit.meetingDate || '',
      meetingComments: visit.meetingComments || '',
      meetingMinutes: visit.meetingMinutes || '',
      venue: visit.venue || '',
      status: visit.status || 'Scheduled' // Default to 'Scheduled' if no status is provided
    }

    // Set provider search state based on the selected visit
    setProviderSearchState(visit);

    // Set venue search state if venue is available
    setVenueSearchState(visit);
  }
}

// Helper function to set venue search state
const setVenueSearchState = (visit) => {
  // Reset venue search state
  selectedVenue.value = null;
  venueSearchTerm.value = '';
  showVenueResults.value = false;

  // If visit has a venue ID, try to fetch venue details
  if (visit.venue) {
    // For now, just set the venue search term to the venue ID
    // In a real implementation, you would fetch the venue details from the API
    venueSearchTerm.value = visit.venue;

    // If we have venue details in the visit object, use them
    if (typeof visit.venue === 'object' && visit.venue.name) {
      selectedVenue.value = visit.venue;
      venueSearchTerm.value = visit.venue.name;
    }
  }
}

// Helper function to set provider search state
const setProviderSearchState = (visit) => {
  if (visit.providerRequestDetails) {
    selectedProvider.value = {
      id: visit.providerId,
      providerName: visit.providerRequestDetails.providerName
    };
    // Clear search term so user can search for a new provider
    providerSearchTerm.value = '';
  } else {
    // If provider details are not available, try to find the provider in the providers list
    const provider = providers.value.find(p => p.id === visit.providerId);
    if (provider) {
      selectedProvider.value = provider;
      // Clear search term so user can search for a new provider
      providerSearchTerm.value = '';
    } else {
      // Reset provider search state if provider not found
      selectedProvider.value = null;
      providerSearchTerm.value = '';
      // Load providers to ensure we have the latest data
      loadProviders();
    }
  }
  // Hide results initially
  showProviderResults.value = false;
}

// Cancel inline edit
const cancelEdit = () => {
  editingVisitId.value = null;

  // Clear form state
  selectedProvider.value = null;
  providerSearchTerm.value = '';
  selectedVenue.value = null;
  venueSearchTerm.value = '';
  showProviderResults.value = false;
  showVenueResults.value = false;
  showCommentsInline.value = false;

  // Keep the visit details visible but exit edit mode
  // selectedVisit.value remains unchanged so details stay visible
}

// Save inline edit
const saveInlineEdit = async () => {
  try {
    const visitId = editingVisitId.value;
    if (!visitId) return;

    await ProviderAPIService.updateVisitMeeting(visitId, visitForm.value);
    showToastMessage('Visit meeting updated successfully');

    // Reset editing state
    editingVisitId.value = null;

    // Reload data
    await loadVisitMeetings();
  } catch (err) {
    console.error('Error updating visit meeting:', err);
    showToastMessage(`Error: ${err.message}`, 'error');
  }
}

// Close visit modal
const closeVisitModal = () => {
  visitModal.value.show = false;

  // Reset search states to prevent stale data
  showProviderResults.value = false;
  showVenueResults.value = false;

  // Also close venue confirmation if it's open
  showVenueConfirmation.value = false;
}

// Save visit meeting (create or update)
const saveVisitMeeting = async () => {
  try {
    if (visitModal.value.isEdit) {
      // Update existing visit
      await ProviderAPIService.updateVisitMeeting(visitModal.value.visit.id, visitForm.value)
      showToastMessage('Visit meeting updated successfully')
    } else {
      // Create new visit
      await ProviderAPIService.createVisitMeeting(visitForm.value)
      showToastMessage('Visit meeting scheduled successfully')
    }

    // Close modal and reload data
    closeVisitModal()
    loadVisitMeetings()
  } catch (err) {
    console.error('Error saving visit meeting:', err)
    showToastMessage(`Error: ${err.message}`, 'error')
  }
}

// Confirm delete
const confirmDelete = (visit) => {
  deleteModal.value = {
    show: true,
    visit: visit
  }
}

// Close delete modal
const closeDeleteModal = () => {
  deleteModal.value.show = false
}

// Delete visit meeting
const deleteVisitMeeting = async () => {
  try {
    await ProviderAPIService.deleteVisitMeeting(deleteModal.value.visit.id)
    showToastMessage('Visit meeting deleted successfully')

    // Close modal and reload data
    closeDeleteModal()
    loadVisitMeetings()
  } catch (err) {
    console.error('Error deleting visit meeting:', err)
    showToastMessage(`Error: ${err.message}`, 'error')
  }
}

// Show toast message
const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Watchers
let searchTimeout = null

watch(searchTerm, (newSearch) => {
  // Debounce search
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 0
    loadVisitMeetings()
  }, 500)
})

// Initialize
onMounted(() => {
  loadProviders()
  loadVisitMeetings()
})
</script>

<style scoped>
.provider-visits-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9fafb;
}

/* Header Section */
.header-section {
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 1.5rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.title-group {
  flex: 1;
}

.main-title {
  display: flex;
  align-items: center;
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.icon {
  width: 1.75rem;
  height: 1.75rem;
  margin-right: 0.75rem;
  color: #3b82f6;
}

.subtitle {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
  color: #1e293b;
  background: #f8fafc;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  min-width: 100px;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

/* Content Section */
.content-section {
  flex: 1;
  padding: 1.5rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.content-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.search-section {
  flex: 1;
  min-width: 300px;
}

.search-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1f2937;
  background-color: #fff;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-section {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.select-wrapper {
  position: relative;
}

.modern-select {
  appearance: none;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1f2937;
  background-color: #fff;
  cursor: pointer;
  min-width: 180px;
}

.modern-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
  pointer-events: none;
}

.date-filter {
  display: flex;
  gap: 0.5rem;
}

.date-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-input-group label {
  font-size: 0.875rem;
  color: #6b7280;
}

.date-input {
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1f2937;
  background-color: #fff;
}

.date-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}


/* Table Container */
.table-container {
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.table-title {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.table-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.75rem;
  color: #3b82f6;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.primary-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.25rem;
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-btn:hover {
  background-color: #2563eb;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  color: #6b7280;
}

.loading-spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  color: #b91c1c;
  text-align: center;
}

.error-icon {
  width: 3rem;
  height: 3rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background-color: #dc2626;
}

/* Table View */
.table-wrapper {
  overflow-x: auto;
}

.visits-table {
  width: 100%;
  border-collapse: collapse;
}

/* Striped rows */
.visits-table tbody tr:nth-child(odd):not(.details-row) {
  background-color: #f9fafb;
}

.visits-table th {
  background-color: #f9fafb;
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
}

.visits-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #1f2937;
}

.visit-row {
  transition: background-color 0.2s;
}

.visit-row:hover {
  background-color: #f9fafb;
}

.visit-row.selected {
  background-color: #eff6ff;
}

.provider-cell {
  display: flex;
  flex-direction: column;
}

.provider-name {
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.provider-category {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.meeting-title {
  font-weight: 500;
}

.visit-date, .meeting-date {
  white-space: nowrap;
}

.venue-name {
  font-weight: 500;
  color: #374151;
}

/* Status Badge Styles */
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-scheduled {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-in-progress {
  background-color: #fef3c7;
  color: #d97706;
}

.status-completed {
  background-color: #d1fae5;
  color: #065f46;
}

.status-cancelled {
  background-color: #fee2e2;
  color: #dc2626;
}

.status-postponed {
  background-color: #f3e8ff;
  color: #7c3aed;
}

/* Table Column Widths */
.th-meeting-id, .td-meeting-id {
  width: 10%;
}

.th-venue, .td-venue {
  width: 12%;
}

.th-status, .td-status {
  width: 10%;
}

/* Meeting ID Badge Styling */
.meeting-id-badge {
  display: inline-block;
  background: #eff6ff;
  color: #1e40af;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #bfdbfe;
  letter-spacing: 0.025em;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  border: none;
  background-color: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.action-btn:hover {
  background-color: #e5e7eb;
}

.action-btn.view:hover, .action-btn.view.active {
  background-color: #dbeafe;
  color: #2563eb;
}

.action-btn.edit:hover {
  background-color: #d1fae5;
  color: #059669;
}

.action-btn.delete:hover {
  background-color: #fee2e2;
  color: #dc2626;
}

.action-icon {
  width: 1rem;
  height: 1rem;
}

/* Inline Details Styles */
.details-row {
  background-color: #f8fafc;
}

.details-row td {
  padding: 0;
}

.details-cell {
  width: 100% !important;
  max-width: none !important;
}

.inline-details {
  padding: 0;
  margin: 0.25rem;
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  width: calc(100% - 0.5rem);
}

.inline-details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.375rem 0.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.inline-details-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.close-details {
  width: 16px;
  height: 16px;
  border: none;
  background: transparent;
  color: #9ca3af;
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: 0.2rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-details:hover {
  color: #6b7280;
  background-color: #f3f4f6;
}

.inline-details-content {
  padding: 0.5rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  width: 100%;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.section-title {
  font-size: 0.7rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  margin-bottom: 0.25rem;
  padding-bottom: 0.125rem;
  border-bottom: 1px solid #e2e8f0;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  margin-bottom: 0.25rem;
}

.detail-label {
  font-size: 0.65rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.01em;
}

.detail-value {
  font-size: 0.7rem;
  color: #1e293b;
  font-weight: 500;
  line-height: 1.3;
}

.inline-detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  margin-bottom: 0.25rem;
}

.detail-link {
  color: #3b82f6;
  text-decoration: none;
}

.detail-link:hover {
  text-decoration: underline;
}

.meeting-minutes, .visit-report {
  white-space: pre-line;
  max-height: 80px;
  overflow-y: auto;
  padding: 0.5rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  font-size: 0.7rem;
  line-height: 1.4;
}

/* Cards View */
.cards-wrapper {
  padding: 1.5rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.visit-card {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
}

.visit-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.visit-card.selected {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.card-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: #eff6ff;
  border-radius: 0.375rem;
  color: #3b82f6;
}

.card-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.date-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
}

.card-body {
  padding: 1rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.card-provider {
  margin-bottom: 0.5rem;
}

.provider-name {
  font-size: 0.875rem;
  color: #4b5563;
}

.card-category {
  margin-bottom: 0.5rem;
}

.category-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #3b82f6;
  background-color: #eff6ff;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
}

.category-badge.compact {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
}

.card-details {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.card-details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.card-details-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.card-details-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card-detail-item {
  display: flex;
  flex-direction: column;
}

.card-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
  color: #6b7280;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #4b5563;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn svg {
  width: 1rem;
  height: 1rem;
  margin: 0 0.25rem;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #4b5563;
  cursor: pointer;
  transition: background-color 0.2s;
}

.page-number:hover {
  background-color: #f3f4f6;
}

.page-number.active {
  background-color: #3b82f6;
  color: #fff;
  border-color: #3b82f6;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.visit-modal {
  width: 100%;
  max-width: 800px;
  height: 650px; /* Fixed height for consistent modal size */
  max-height: 90vh;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.delete-modal {
  width: 100%;
  max-width: 500px;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close svg {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-body {
  padding: 1.25rem;
  overflow-y: auto;
  height: calc(650px - 130px); /* Fixed height based on modal height minus header and footer */
  max-height: calc(90vh - 130px);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

/* Form Styles */
.modern-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Beautiful Form Layout */
.beautiful-form-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.beautiful-form-layout .form-section {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.beautiful-form-layout .form-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0; /* Removed the blue stripe by setting height to 0 */
  border-radius: 12px 12px 0 0;
}

.beautiful-form-layout .form-section:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

/* Enhanced Input Groups */
.beautiful-form-layout .input-group {
  position: relative;
  margin-bottom: 1rem;
}

.beautiful-form-layout .input-group:last-child {
  margin-bottom: 0;
}

.beautiful-form-layout .input-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;
}

.beautiful-form-layout .input-group:focus-within .input-label {
  color: #3b82f6;
}

/* Enhanced Inputs */
.beautiful-form-layout .modern-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #1f2937;
  background: #ffffff;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.beautiful-form-layout .modern-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

/* Enhanced Search Results */
.beautiful-form-layout .search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 50;
  max-height: 200px;
  overflow-y: auto;
}

.beautiful-form-layout .search-result-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 0.875rem;
  color: #1f2937;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.beautiful-form-layout .search-result-item::before {
  content: '👤';
  font-size: 0.75rem;
  opacity: 0.6;
}

.beautiful-form-layout .search-result-item:hover {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  color: #0ea5e9;
  transform: translateX(4px);
}

.beautiful-form-layout .search-result-item:last-child {
  border-bottom: none;
}

/* Enhanced Selected Items */
.beautiful-form-layout .selected-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 2px solid #10b981;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #047857;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.beautiful-form-layout .clear-selection {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.beautiful-form-layout .clear-selection:hover {
  background: #dc2626;
  transform: scale(1.1);
}

/* Enhanced Select */
.beautiful-form-layout .modern-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
}

/* Enhanced Textarea */
.beautiful-form-layout .modern-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #1f2937;
  background: #ffffff;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  line-height: 1.5;
}

.beautiful-form-layout .modern-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Enhanced Section Headers */
.beautiful-form-layout .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0;
}

.beautiful-form-layout .section-header:hover {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.beautiful-form-layout .section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.beautiful-form-layout .collapse-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
  transition: transform 0.3s ease;
}

.beautiful-form-layout .collapse-icon.rotated {
  transform: rotate(180deg);
}

/* Enhanced Collapsible Content */
.beautiful-form-layout .collapsible-content {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-top: none;
  border-radius: 0 0 8px 8px;
  background: #ffffff;
  animation: expandDown 0.3s ease;
}

@keyframes expandDown {
  from {
    opacity: 0;
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
  }
  to {
    opacity: 1;
    max-height: 500px;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
}

/* Required Field Enhancement */
.beautiful-form-layout .required {
  color: #ef4444;
  font-weight: 700;
  margin-left: 0.25rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* Beautiful Inline Edit Form */
.inline-edit-beautiful {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  position: relative;
  margin: 0.25rem;
}

.inline-edit-beautiful::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 0.375rem 0.375rem 0 0;
}

.inline-edit-beautiful .compact-edit-form {
  padding: 1rem;
  background: transparent;
}

/* Enhanced Compact Rows */
.inline-edit-beautiful .compact-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: start;
}

.inline-edit-beautiful .compact-row:last-child {
  margin-bottom: 0;
}

.inline-edit-beautiful .compact-field {
  flex: 1;
  min-width: 0;
}

/* Enhanced Compact Labels */
.inline-edit-beautiful .compact-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
  transition: color 0.2s ease;
}

.inline-edit-beautiful .compact-field:focus-within .compact-label {
  color: #3b82f6;
}

/* Enhanced Compact Inputs */
.inline-edit-beautiful .compact-input,
.inline-edit-beautiful .compact-select,
.inline-edit-beautiful .compact-textarea {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #1f2937;
  background: #ffffff;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.inline-edit-beautiful .compact-input:focus,
.inline-edit-beautiful .compact-select:focus,
.inline-edit-beautiful .compact-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

/* Disabled Input Styling */
.inline-edit-beautiful .compact-input.disabled {
  background-color: #f9fafb;
  border-color: #d1d5db;
  color: #6b7280;
  cursor: not-allowed;
}

.inline-edit-beautiful .compact-input.disabled:focus {
  border-color: #d1d5db;
  box-shadow: none;
  transform: none;
}

/* Enhanced Compact Textarea */
.inline-edit-beautiful .compact-textarea {
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
  line-height: 1.4;
}

/* Enhanced Provider Search */
.inline-edit-beautiful .provider-search-compact {
  position: relative;
}

.inline-edit-beautiful .compact-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 50;
  max-height: 150px;
  overflow-y: auto;
}

.inline-edit-beautiful .search-result-item {
  padding: 0.6rem 0.8rem;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 0.875rem;
  color: #1f2937;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.inline-edit-beautiful .search-result-item::before {
  content: '👤';
  font-size: 0.7rem;
  opacity: 0.6;
}

.inline-edit-beautiful .search-result-item:hover {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  color: #0369a1;
  transform: translateX(2px);
}

.inline-edit-beautiful .search-result-item:last-child {
  border-bottom: none;
}

/* Enhanced Selected Provider */
.inline-edit-beautiful .selected-compact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px solid #3b82f6;
  border-radius: 6px;
  padding: 0.4rem 0.6rem;
  margin-top: 0.4rem;
  font-size: 0.8rem;
  color: #1e40af;
  animation: fadeInScale 0.3s ease;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.inline-edit-beautiful .clear-compact {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.inline-edit-beautiful .clear-compact:hover {
  background: #dc2626;
  transform: scale(1.1);
}

/* Enhanced Comments Section */
.inline-edit-beautiful .comments-section {
  flex-direction: column;
  gap: 0;
}

.inline-edit-beautiful .comments-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0;
}

.inline-edit-beautiful .comments-toggle:hover {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.inline-edit-beautiful .toggle-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
}

.inline-edit-beautiful .toggle-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: #64748b;
  transition: transform 0.3s ease;
}

.inline-edit-beautiful .toggle-icon.rotated {
  transform: rotate(180deg);
}

.inline-edit-beautiful .comments-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-top: none;
  border-radius: 0 0 6px 6px;
  background: #ffffff;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enhanced Required Fields */
.inline-edit-beautiful .required {
  color: #ef4444;
  font-weight: 700;
  margin-left: 0.25rem;
  animation: pulse 2s infinite;
}

/* Enhanced Compact Actions */
.inline-edit-beautiful .compact-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
  margin-top: 0.75rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .inline-edit-beautiful .compact-row {
    flex-direction: column;
    gap: 0.75rem;
  }

  .inline-edit-beautiful .comments-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}

.form-row {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.form-row.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.input-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

/* Detail Grid Styles */
.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.detail-section {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.25rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-top: 0;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.detail-item {
  margin-bottom: 1rem;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.input-wrapper {
  position: relative;
}

.required {
  color: #ef4444;
  font-weight: 600;
  margin-left: 0.25rem;
}

/* Compact Inline Edit Form - UI/UX Optimized */
.inline-edit-compact {
  margin-top: 0.5rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.compact-edit-form {
  padding: 1rem;
  background: transparent;
}

/* Compact Row Layout */
.compact-row {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  align-items: start;
}

.compact-row:last-child {
  margin-bottom: 0;
}

.compact-field {
  flex: 1;
  min-width: 0;
}

/* Compact Labels */
.compact-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.25rem;
  line-height: 1.2;
}

/* Compact Inputs */
.compact-input,
.compact-select,
.compact-textarea {
  width: 100%;
  padding: 0.375rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #1f2937;
  background: #ffffff;
  transition: border-color 0.15s ease;
  height: 2rem;
}

.compact-input:focus,
.compact-select:focus,
.compact-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
}

.compact-textarea {
  height: auto;
  resize: vertical;
  min-height: 2.5rem;
  font-family: inherit;
  line-height: 1.4;
}

/* Provider Search Compact */
.provider-search-compact {
  position: relative;
}

.compact-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 120px;
  overflow-y: auto;
  z-index: 50;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-result-item {
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.15s ease;
}

.search-result-item:hover {
  background: #f9fafb;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item.no-results {
  color: #6b7280;
  cursor: default;
}

.search-result-item.no-results:hover {
  background: transparent;
}

/* Selected Provider Compact */
.selected-compact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #eff6ff;
  border: 1px solid #3b82f6;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #1e40af;
}

.clear-compact {
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  font-size: 0.625rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.clear-compact:hover {
  background: #b91c1c;
  transform: scale(1.1);
}

/* Comments Section */
.comments-section {
  flex-direction: column;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0;
  margin-bottom: 0.5rem;
}

.comments-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  background: #f1f5f9;
  border-radius: 6px 6px 0 0;
  transition: background-color 0.15s ease;
}

.comments-toggle:hover {
  background: #e2e8f0;
}

.toggle-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.toggle-icon {
  width: 1rem;
  height: 1rem;
  color: #6b7280;
  transition: transform 0.2s ease;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.comments-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #ffffff;
  border-radius: 0 0 6px 6px;
}

/* Enhanced Comments Section Styling */
.comments-grid .compact-field {
  background: #fafbfc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 0.5rem;
  transition: all 0.15s ease;
}

.comments-grid .compact-field:hover {
  border-color: #cbd5e1;
  background: #ffffff;
}

.comments-grid .compact-field:focus-within {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1);
}

.comments-grid .compact-label {
  color: #475569;
  font-weight: 600;
  margin-bottom: 0.375rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.comments-grid .compact-textarea {
  border: none;
  background: transparent;
  resize: vertical;
  min-height: 2.25rem;
  padding: 0.375rem;
  font-size: 0.8rem;
  line-height: 1.4;
  color: #374151;
}

.comments-grid .compact-textarea:focus {
  outline: none;
  box-shadow: none;
}

.comments-grid .compact-textarea::placeholder {
  color: #9ca3af;
  font-style: italic;
}

/* Compact Actions */
.compact-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding-top: 0.5rem;
  border-top: 1px solid #e2e8f0;
}

.inline-actions {
  display: flex;
  gap: 0.375rem;
  justify-content: flex-end;
  padding-top: 0.375rem;
  border-top: 1px solid #e2e8f0;
}

.btn-compact {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-edit {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.btn-edit:hover {
  background: #2563eb;
  border-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-delete {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.btn-delete:hover {
  background: #dc2626;
  border-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  width: 0.75rem;
  height: 0.75rem;
}

.btn-compact {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  height: 2rem;
}

.btn-secondary {
  background: #f9fafb;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: 1px solid #3b82f6;
}

.btn-primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.icon-xs {
  width: 0.75rem;
  height: 0.75rem;
}

/* Responsive Design for Compact Form */
@media (max-width: 768px) {
  .compact-row {
    flex-direction: column;
    gap: 0.5rem;
  }

  .comments-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .compact-actions {
    flex-direction: column-reverse;
    gap: 0.375rem;
  }

  .btn-compact {
    justify-content: center;
  }

  .compact-edit-form {
    padding: 0.75rem;
  }
}

.modern-input {
  padding: 0.625rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #1f2937;
  width: 100%;
  height: 38px;
  transition: all 0.2s;
  background-color: #fff;
}

.modern-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.modern-input:hover:not(:focus) {
  border-color: #d1d5db;
  background-color: #f9fafb;
}

.modern-textarea {
  padding: 0.625rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #1f2937;
  width: 100%;
  min-height: 80px;
  resize: vertical;
  transition: all 0.2s;
  background-color: #fff;
}

.modern-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.modern-textarea:hover:not(:focus) {
  border-color: #d1d5db;
  background-color: #f9fafb;
}

.secondary-btn {
  padding: 0.625rem 1.25rem;
  background-color: #fff;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.secondary-btn:hover {
  background-color: #f3f4f6;
}

.danger-btn {
  padding: 0.625rem 1.25rem;
  background-color: #ef4444;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.danger-btn:hover {
  background-color: #dc2626;
}

.warning-text {
  color: #ef4444;
  font-weight: 500;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 100;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.success-toast {
  border-left: 4px solid #10b981;
}

.toast-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #10b981;
  margin-right: 1rem;
}

.toast-content h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.toast-content p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Compact Form Layout Styles */
.compact-form-layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex: 1;
}

/* Compact Visit Form Styles */
.compact-visit-form {
  padding: 0;
}

.compact-visit-form .form-section {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 0;
}

.compact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  align-items: start;
}

.compact-input {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  height: 2.5rem;
}

.compact-selected {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
  margin-top: 0.375rem;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.375rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.compact-textarea {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  min-height: 4rem;
  resize: vertical;
}

.compact-textarea-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Section Header for Collapsible Content */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  margin-bottom: 0;
  transition: all 0.2s;
}

.section-header:hover {
  background-color: #e5e7eb;
}

.section-title {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.collapse-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
  transition: transform 0.2s;
}

.collapse-icon.rotated {
  transform: rotate(180deg);
}

.collapsible-content {
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-top: none;
  border-radius: 0 0 0.5rem 0.5rem;
  background-color: #ffffff;
}

.form-column {
  min-width: 250px;
}

.form-section {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
}

.form-section.full-width {
  width: 100%;
  margin-bottom: 1rem;
  grid-column: 1 / -1;
}

.form-row {
  margin-bottom: 0.5rem;
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-row.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Provider and Venue Search Styles */
.provider-search, .venue-search {
  position: relative;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 180px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #d1d5db;
  border-top: none;
  border-radius: 0 0 0.375rem 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 10;
}

.search-result-item {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: all 0.15s;
  font-size: 0.875rem;
  color: #1f2937;
  border-bottom: 1px solid #f3f4f6;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.search-result-item.no-results {
  color: #6b7280;
  font-style: italic;
  cursor: default;
  padding: 0.625rem 0.75rem;
  text-align: center;
}

.selected-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.375rem;
  padding: 0.375rem 0.625rem;
  background-color: #eef2ff;
  border: 1px solid #c7d2fe;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #4f46e5;
  transition: all 0.2s;
}

.selected-item:hover {
  background-color: #e0e7ff;
}

.clear-selection {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 1.125rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  margin-left: 0.5rem;
  transition: color 0.2s;
}

.clear-selection:hover {
  color: #ef4444;
}

/* Venue Confirmation Modal Styles */
.confirmation-modal {
  width: 100%;
  max-width: 500px;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.venue-details {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-top: 1rem;
}

.venue-detail-item {
  display: flex;
  margin-bottom: 0.5rem;
}

.venue-detail-item:last-child {
  margin-bottom: 0;
}

.venue-detail-item label {
  font-weight: 600;
  width: 100px;
  color: #4b5563;
}

.venue-detail-item span {
  color: #1f2937;
}

/* Enterprise Modal & Form Styles */
.enterprise-modal {
  max-width: 700px;
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.modern-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
  height: 38px;
}

.modern-select:hover:not(:focus) {
  border-color: #d1d5db;
  background-color: #f9fafb;
}

.enterprise-form {
  gap: 0.5rem;
}

.form-tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.25rem 0.25rem 0 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.tab-button {
  display: flex;
  align-items: center;
  padding: 0.625rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #6b7280;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button:hover {
  color: #4b5563;
  background-color: #f3f4f6;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
  background-color: #eff6ff;
  font-weight: 600;
}

.tab-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.375rem;
}

.tab-content {
  padding: 0.375rem 0 0.5rem;
  height: 100%; /* Fill the available height in the modal-body */
  overflow-y: auto; /* Allow scrolling for overflow content */
  display: flex;
  flex-direction: column;
}

/* Three column layout */
.form-row.three-columns {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 1rem;
  width: 100%;
}

.form-row.three-columns .input-group {
  flex: 1;
  width: 33.33%;
  min-width: 0;
}

/* Fix for date inputs to prevent overflow */
.form-row.three-columns .input-group input[type="date"] {
  width: 100%;
  min-width: 0; /* Prevents date inputs from overflowing */
}

/* More compact form sections */
.enterprise-form .form-section {
  padding: 0.75rem;
  margin-bottom: 0.625rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.enterprise-form .input-label {
  font-size: 0.8125rem;
  margin-bottom: 0.25rem;
  font-weight: 500;
  color: #4b5563;
  display: block;
}

.enterprise-form .input-group {
  margin-bottom: 0.375rem;
}

.enterprise-form .input-group:last-child {
  margin-bottom: 0;
}

.enterprise-form .modern-input,
.enterprise-form .modern-textarea,
.enterprise-form .modern-select {
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  width: 100%;
  border-color: #d1d5db;
}

.enterprise-form .modern-textarea {
  min-height: 70px;
}

.enterprise-form .selected-item {
  padding: 0.375rem 0.625rem;
  margin-top: 0.25rem;
  font-size: 0.8125rem;
}

/* Horizontal Form Row */
.form-row.horizontal {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
}

.form-row.horizontal .input-group {
  flex: 1;
  width: 100%;
  min-width: 0;
}

/* Rich Text Editor Styles */
.rich-text-editor {
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
  background-color: #fff;
  transition: all 0.2s;
}

.rich-text-editor:hover {
  border-color: #d1d5db;
}

.rich-text-editor:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.rich-text-toolbar {
  display: flex;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: none;
  border: none;
  border-radius: 0.25rem;
  color: #4b5563;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s;
}

.toolbar-btn:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.toolbar-btn:active {
  background-color: #e5e7eb;
}

.rich-textarea {
  border: none;
  border-radius: 0;
  min-height: 120px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.rich-textarea:focus {
  box-shadow: none;
  outline: none;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  /* Compact Form Responsive Styles */
  .compact-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .compact-textarea-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .compact-visit-form .form-section {
    padding: 0.75rem;
  }

  .section-header {
    padding: 0.5rem 0.75rem;
  }

  .collapsible-content {
    padding: 0.75rem;
  }

  .header-stats {
    width: 100%;
    justify-content: space-between;
  }

  .content-header {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  .form-row.two-columns {
    grid-template-columns: 1fr;
  }

  .form-row.three-columns {
    flex-direction: column;
  }

  .form-row.three-columns .input-group {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .form-row.horizontal {
    flex-direction: column;
  }

  .form-row.horizontal .input-group {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .inline-details-content {
    grid-template-columns: 1fr;
  }

  /* Compact form layout adjustments */
  .compact-form-layout {
    flex-direction: column;
  }

  .form-column {
    width: 100%;
  }

  .form-section.full-width .form-row.two-columns {
    grid-template-columns: 1fr;
  }

  /* Venue confirmation modal adjustments */
  .confirmation-modal {
    width: 90%;
    max-width: none;
  }

  .venue-detail-item {
    flex-direction: column;
  }

  .venue-detail-item label {
    width: 100%;
    margin-bottom: 0.25rem;
  }

  /* Tab adjustments for mobile */
  .form-tabs {
    overflow-x: auto;
  }

  .tab-button {
    padding: 0.625rem 1rem;
    white-space: nowrap;
  }
}
</style>
