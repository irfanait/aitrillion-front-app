// customerDetailsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  createCustomerDetailsaddToList,
  customerDetailsAddMembershipPlanApi,
  customerDetailsaddToList,
  customerDetailsAffiliateListApi,
  customerDetailsAssignGroupApi,
  customerDetailsEmailUpdateApi,
  customerDetailsGetAffiliateGroupListApi,
  customerDetailsgetListsApi,
  customerDetailsMembershipApi,
  customerDetailsMembershipListApi,
  customerDetailsMembershipPlanListApi,
  customerDetailsOrdersApi,
  customerDetailsOrdersDetailsApi,
  customerDetailsRemoveListApi,
  customerDetailsUpdateAffiliateGroupApi,
  getCustomerDetailsApi,
  getCustomerDetailsCustomFieldsApi,
  getCustomerDetailsTimelineApi,
  getVisitedProductList,
  updateCustomerStatusApi,
  updateCustomFieldApi,
} from '@/redux/apis/customers-api/customersApi';

const initialState = {
  data: null,
  loading: false,
  error: null,

  customFields: [],
  customFieldsLoading: false,
  customFieldsError: null,
  customFieldValues: {},
  customerPointExpiryData: {},
  customFieldCount: 0,

  emailUpdateApiState: '',
  emailUpdateLoading: false,
  emailUpdateError: null,
  emailUpdateMessage: '',

  statusUpdatingApiState: '',
  emailUpdateMessage: '',
  statusUpdating: false,
  statusUpdateError: null,

  timeline: [],
  timelineLoading: false,
  loadingMore: false,
  timelineError: null,
  today: '',
  yesterday: '',
  timelinePagination: {
    total: 0,
    totalPages: 0,
    currentPage: 1,
  },

  customerOrders: [],
  customerOrdersError: '',
  customerOrdersLoading: false,
  customerOrdersPagination: {
    currentPage: 1,
    totalRecords: 0,
    limit: 10,
  },

  orderDetails: null,
  orderDetailsLoading: false,
  orderDetailsError: null,

  membershipList: [],
  customerMembershipListError: '',
  customerMembershipListLoading: false,

  membershipPlans: [],
  membershipPlansLoading: false,
  membershipPlansError: null,

  addMembershipPlanData: {},
  addMembershipPlanApiState: '',
  addMembershipPlansLoading: false,
  addMembershipPlansError: null,

  getOrderLineItems: [],
  getOrderLineItemsLoading: false,
  getOrderLineItemsError: null,

  listForAddList: [],
  listForAddListLoading: false,
  listForAddListError: null,

  createLisCustomerDetailstData: {},
  createLisCustomerDetailstApiState: '',
  createLisCustomerDetailstLoading: false,
  createLisCustomerDetailstError: null,

  customerDetailsRemoveListApiState: '',
  customerDetailsRemoveListLoading: false,
  customerDetailsRemoveListError: null,

  affiliateGroups: [],
  affiliateGroupApiState: '',
  affiliateGroupLoading: false,
  affiliateGroupError: null,

  getAffiliateGroupList: [],
  getAffiliateGroupListApiState: '',
  getAffiliateGroupListLoading: false,
  getAffiliateGroupListError: null,

  customerDetailsUpdateAffiliateGroup: [],
  customerDetailsUpdateAffiliateGroupApiState: '',
  customerDetailsUpdateAffiliateGroupLoading: false,
  customerDetailsUpdateAffiliateGroupError: null,

  customerDetailsAssignAffiliateGroup: [],
  customerDetailsAssignAffiliateGroupApiState: '',
  customerDetailsAssignAffiliateGroupLoading: false,
  customerDetailsAssignAffiliateGroupError: null,

  visitedProducts: [],
  visitedProductsLoading: false,
  visitedProductsPage: 1,
  visitedProductsTotalPages: 1,
};

const customerDetailsSlice = createSlice({
  name: 'customerDetails',
  initialState,
  reducers: {
    updateCustomFieldValue: (state, action) => {
      const { key, value } = action.payload;

      state.customFieldValues[key] = value;

      const index = state.customFields.findIndex((f) => f.field_name === key);
      if (index !== -1) {
        const field = state.customFields[index];

        field.field_value = value;
        // Convert everything to readable text for UI
        if (Array.isArray(value)) {
          field.field_value_str = value.join(', ');
        } else if (typeof value === 'object' && value !== null) {
          field.field_value_str = Object.keys(value).join(', ');
        } else {
          field.field_value_str = value ?? '';
        }
      }
    },
    updateEmailUnsubscribeState: (state, action) => {
      const { email_marketing, review_email, email_workflow } = action.payload;

      // Store in data.customer.unsubscribe (or similar)
      if (!state.data || !Array.isArray(state.data) || !state.data[0]) return;

      const customer = state.data[0];

      // Ensure nested object exists
      if (!customer.unsubscribeData) {
        customer.unsubscribeData = {};
      }

      customer.email_marketing = email_marketing;
      customer.review_email = review_email;
      customer.email_workflow = email_workflow;
    },

    resetEmailUpdateStatus: (state) => {
      state.emailUpdateApiState = '';
      state.emailUpdateLoading = false;
      state.emailUpdateError = null;
      state.emailUpdateMessage = '';
    },
    updateCustomerStatusLocal: (state, action) => {
      const is_inactive = action.payload; // '0' or '1'

      if (state.data?.[0]) {
        state.data[0].is_inactive = is_inactive;

        // optional but useful for UI consistency
        state.data[0].inactive_status_class =
          is_inactive === '1' ? 'bg-inactive' : 'bg-active';

        if (is_inactive === '0') {
          state.data[0].last_active_date = new Date().toISOString();
        } else {
          state.data[0].last_inactive_date = new Date().toISOString();
        }
      }
    },

    updateCustomerStatusReset: (state) => {
      state.statusUpdatingApiState = '';
      state.emailUpdateMessage = '';
      state.statusUpdating = false;
      state.statusUpdateError = null;
    },

    addMembershipPlanReset: (state) => {
      state.addMembershipPlanData = {};
      state.addMembershipPlanApiState = '';
      state.addMembershipPlansLoading = false;
      state.addMembershipPlansError = null;
    },

    createLisCustomerDetailstReset: (state) => {
      state.createLisCustomerDetailstData = {};
      state.createLisCustomerDetailstApiState = '';
      state.createLisCustomerDetailstLoading = false;
      state.createLisCustomerDetailstError = null;
    },
    customerDetailsRemoveListReset: (state) => {
      state.customerDetailsRemoveListApiState = '';
      state.customerDetailsRemoveListLoading = false;
      state.customerDetailsRemoveListError = null;
    },
    customerDetailsUpdateAffiliateGroupReset: (state) => {
      state.customerDetailsUpdateAffiliateGroupApiState = '';
      state.customerDetailsUpdateAffiliateGroupLoading = false;
      state.customerDetailsUpdateAffiliateGroupError = null;
    },

    customerDetailsAssignGroupReset: (state) => {
      state.customerDetailsAssignAffiliateGroup = [];
      state.customerDetailsAssignAffiliateGroupApiState = '';
      state.customerDetailsAssignAffiliateGroupLoading = false;
      state.customerDetailsAssignAffiliateGroupError = null;
    },
  },

  extraReducers: (builder) => {
    // CUSTOMER DETAILS
    builder
      .addCase(getCustomerDetailsApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCustomerDetailsApi.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action?.payload?.rows || null;
      })

      .addCase(getCustomerDetailsApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load customer details';
      });

    // CUSTOMER CUSTOM FIELDS
    builder
      .addCase(getCustomerDetailsCustomFieldsApi.pending, (state) => {
        state.customFieldsLoading = true;
        state.customFieldsError = null;
      })

      .addCase(getCustomerDetailsCustomFieldsApi.fulfilled, (state, action) => {
        state.customFieldsLoading = false;

        const payload = action.payload;

        state.customFields = payload?.customFieldArrData || [];
        state.customFieldValues = payload?.customeCustomFieldRow || {};
        state.customFieldCount = payload?.customRowCount || 0;
        state.customerPointExpiryData = payload?.customerPointExpiryData || {};
      })

      .addCase(getCustomerDetailsCustomFieldsApi.rejected, (state, action) => {
        state.customFieldsLoading = false;
        state.customFieldsError =
          action.payload || 'Failed to load custom fields';
      });

    // UPDATE CUSTOM FIELD (Edit modal submit)
    builder
      .addCase(updateCustomFieldApi.pending, (state) => {
        state.customFieldUpdating = true;
      })
      .addCase(updateCustomFieldApi.fulfilled, (state, action) => {
        state.customFieldUpdating = false;

        const updated = action.meta.arg; // payload sent to API
        const key = updated.field_name; // e.g. custom5
        let displayValue = updated.field_value;

        // convert checkbox object-string to display format
        if (updated.field_type === 'checkbox') {
          try {
            const parsed = JSON.parse(updated.field_value);
            displayValue = Object.keys(parsed).join(', ');
          } catch {
            displayValue = updated.field_value;
          }
        }

        state.customFieldValues[key] = displayValue;
      })
      .addCase(updateCustomFieldApi.rejected, (state, action) => {
        state.customFieldUpdating = false;
        state.customFieldsError = action.payload;
      });
    // Update customer details email status
    builder
      .addCase(customerDetailsEmailUpdateApi.pending, (state) => {
        state.emailUpdateLoading = true;
        state.emailUpdateError = null;
        state.emailUpdateApiState = 'pending';
      })
      .addCase(customerDetailsEmailUpdateApi.fulfilled, (state, action) => {
        state.emailUpdateApiState = 'success';
        state.emailUpdateLoading = false;

        const updated = action.meta.arg;

        const customer = state.data?.[0];
        if (customer) {
          customer.unsubscribeData = {
            email_marketing: updated.email_marketing,
            review_email: updated.review_email,
            email_workflow: updated.email_workflow,
          };
        }

        state.emailUpdateMessage =
          action?.payload?.msg || 'Status update successfully';
      })
      .addCase(customerDetailsEmailUpdateApi.rejected, (state, action) => {
        state.emailUpdateApiState = 'error';
        state.emailUpdateLoading = false;
        state.emailUpdateMessage = action?.payload?.msg || 'Update failed';
      });
    builder
      .addCase(updateCustomerStatusApi.pending, (state) => {
        state.statusUpdatingApiState = 'pending';
        state.emailUpdateMessage = '';
        state.statusUpdating = true;
        state.statusUpdateError = null;
      })
      .addCase(updateCustomerStatusApi.fulfilled, (state, action) => {
        state.statusUpdatingApiState = action?.payload?.status || 'success';
        state.emailUpdateMessage =
          action?.payload?.sql || 'status updated successfully';
        state.statusUpdating = false;
      })
      .addCase(updateCustomerStatusApi.rejected, (state, action) => {
        state.statusUpdatingApiState = action?.payload?.status || 'error';
        state.emailUpdateMessage =
          action?.payload?.msg || 'Failed to update status';

        state.statusUpdating = false;
        state.statusUpdateError =
          action.payload?.msg || 'Failed to update status';
      });

    // CUSTOMER TIMELINE
    builder
      .addCase(getCustomerDetailsTimelineApi.pending, (state, action) => {
        const page = action.meta.arg?.currentPage || 1;

        if (page === 1) {
          state.timelineLoading = true;
        } else {
          state.loadingMore = true;
        }

        state.timelineError = null;
      })

      .addCase(getCustomerDetailsTimelineApi.fulfilled, (state, action) => {
        const payload = action.payload;
        const page = Number(payload?.currentPage) || 1;

        state.timelineLoading = false;
        state.loadingMore = false;

        // Page 1 = replace | Page 2+ = append
        if (page === 1) {
          state.timeline = payload?.activityLog || [];
        } else {
          state.timeline = [...state.timeline, ...(payload?.activityLog || [])];
        }

        // Remove duplicates (safe merge)
        state.timelinePagination.currentPage = Math.min(
          page,
          state.timelinePagination.totalPages
        );

        if (page >= payload?.totalpages) {
          state.loadingMore = false;
        }

        state.today = payload?.current_day;
        state.yesterday = payload?.yester_day;

        state.timelinePagination = {
          total: payload?.totalrecord || 0,
          totalPages: payload?.totalpages || 0,
          currentPage: page,
        };
      })

      .addCase(getCustomerDetailsTimelineApi.rejected, (state, action) => {
        state.timelineLoading = false;
        state.loadingMore = false;
        state.timelineError = action.payload || 'Failed to load timeline.';
      });

    //orders
    builder
      .addCase(customerDetailsOrdersApi.pending, (state, action) => {
        const page = action.meta.arg.currentPage;

        if (page === 1) {
          state.customerOrdersLoading = true;
        }

        state.customerOrdersError = null;
      })
      .addCase(customerDetailsOrdersApi.fulfilled, (state, action) => {
        const payload = action.payload;

        state.customerOrdersLoading = false;

        state.customerOrders = payload.data || [];

        state.customerOrdersPagination = {
          currentPage: Number(payload.currentPage) || 1,
          totalRecords: Number(payload.totalrecord) || 0,
          limit: 10,
        };
      })
      .addCase(customerDetailsOrdersApi.rejected, (state, action) => {
        state.customerOrdersLoading = false;
        state.customerOrdersError = action.payload;
      });
    // ORDER DETAILS
    builder
      .addCase(customerDetailsOrdersDetailsApi.pending, (state) => {
        state.orderDetailsLoading = true;
        state.orderDetailsError = null;
      })
      .addCase(customerDetailsOrdersDetailsApi.fulfilled, (state, action) => {
        state.orderDetailsLoading = false;
        state.orderDetails = action?.payload?.data; // full details + items array
      })
      .addCase(customerDetailsOrdersDetailsApi.rejected, (state, action) => {
        state.orderDetailsLoading = false;
        state.orderDetailsError =
          action.payload || 'Failed to load order details';
      });
    //membership list
    builder
      .addCase(customerDetailsMembershipListApi.pending, (state) => {
        state.customerMembershipListError = null;
        state.customerMembershipListLoading = true;
      })
      .addCase(customerDetailsMembershipListApi.fulfilled, (state, action) => {
        state.membershipList = action?.payload?.list || [];
        state.customerMembershipListError = action?.payload?.msg;
        state.customerMembershipListLoading = false;
      })
      .addCase(customerDetailsMembershipListApi.rejected, (state, action) => {
        state.customerMembershipListLoading = false;
        state.orderDetailsError =
          action.payload || 'Failed to load membership list';
      });
    builder
      .addCase(customerDetailsMembershipPlanListApi.pending, (state) => {
        state.membershipPlansLoading = true;
        state.membershipPlansError = null;
      })

      .addCase(
        customerDetailsMembershipPlanListApi.fulfilled,
        (state, action) => {
          state.membershipPlansLoading = false;
          state.membershipPlans = action?.payload?.data || [];
        }
      )

      .addCase(
        customerDetailsMembershipPlanListApi.rejected,
        (state, action) => {
          state.membershipPlansLoading = false;
          state.membershipPlansError = action.payload || 'Something went wrong';
        }
      );
    builder
      .addCase(customerDetailsAddMembershipPlanApi.pending, (state) => {
        state.addMembershipPlanApiState = 'pending';
        state.addMembershipPlansLoading = true;
        state.addMembershipPlansError = null;
      })

      .addCase(
        customerDetailsAddMembershipPlanApi.fulfilled,
        (state, action) => {
          state.addMembershipPlanApiState =
            action?.payload?.status || 'success';

          state.addMembershipPlansLoading = false;
          state.addMembershipPlansError = action?.payload?.msg || 'success';
          state.addMembershipPlanData = action.payload?.data || [];
        }
      )

      .addCase(
        customerDetailsAddMembershipPlanApi.rejected,
        (state, action) => {
          state.addMembershipPlanApiState = action?.payload?.status || 'error';
          state.addMembershipPlansLoading = false;
          state.addMembershipPlansError =
            action?.payload?.front_msg || 'Something went wrong';
        }
      );
    builder
      .addCase(customerDetailsgetListsApi.pending, (state) => {
        state.getOrderLineItemsLoading = true;
        state.getOrderLineItemsError = null;
      })

      .addCase(customerDetailsgetListsApi.fulfilled, (state, action) => {
        state.getOrderLineItemsLoading = false;
        state.getOrderLineItemsError = action?.payload?.msg || 'success';
        state.getOrderLineItems = action.payload?.data || [];
      })

      .addCase(customerDetailsgetListsApi.rejected, (state, action) => {
        state.getOrderLineItemsLoading = false;
        state.getOrderLineItemsError =
          action?.payload?.msg || 'Something went wrong';
      });
    builder
      .addCase(customerDetailsaddToList.pending, (state) => {
        state.listForAddListLoading = true;
        state.listForAddListError = null;
      })

      .addCase(customerDetailsaddToList.fulfilled, (state, action) => {
        state.listForAddListLoading = false;
        state.listForAddListError = action?.payload?.msg || 'success';
        state.listForAddList = action.payload || [];
      })

      .addCase(customerDetailsaddToList.rejected, (state, action) => {
        state.listForAddListLoading = false;
        state.listForAddListError =
          action?.payload?.msg || 'Something went wrong';
      });

    builder
      .addCase(createCustomerDetailsaddToList.pending, (state) => {
        state.createLisCustomerDetailstApiState = 'pending';
        state.createLisCustomerDetailstLoading = true;
        state.createLisCustomerDetailstError = null;
      })

      .addCase(createCustomerDetailsaddToList.fulfilled, (state, action) => {
        state.createLisCustomerDetailstApiState =
          action?.payload?.status || 'success';
        state.createLisCustomerDetailstLoading = false;
        state.createLisCustomerDetailstError =
          action?.payload?.msg || 'List added successfully';
        state.createLisCustomerDetailstData = action.payload?.data || {};
      })

      .addCase(createCustomerDetailsaddToList.rejected, (state, action) => {
        state.createLisCustomerDetailstApiState =
          action?.payload?.status || 'pending';
        state.createLisCustomerDetailstLoading = false;
        state.createLisCustomerDetailstError = action?.payload?.msg || 'error';
      });

    builder
      .addCase(customerDetailsRemoveListApi.pending, (state) => {
        state.customerDetailsRemoveListApiState = 'pending';
        state.customerDetailsRemoveListLoading = true;
        state.customerDetailsRemoveListError = null;
      })

      .addCase(customerDetailsRemoveListApi.fulfilled, (state, action) => {
        state.customerDetailsRemoveListApiState =
          action?.payload?.status || 'success';
        state.customerDetailsRemoveListLoading = false;
        state.customerDetailsRemoveListError =
          action?.payload?.msg || 'List deleted successfully';

        // Extract removed ID
        const removedId =
          action?.meta?.arg?.id || action?.payload?.data?.data?.id;

        if (removedId) {
          // Remove from getOrderLineItems list
          state.getOrderLineItems = state.getOrderLineItems.filter(
            (item) => item.id !== removedId
          );
        }
      })

      .addCase(customerDetailsRemoveListApi.rejected, (state, action) => {
        state.customerDetailsRemoveListApiState =
          action?.payload?.status || 'error';
        state.customerDetailsRemoveListLoading = false;
        state.customerDetailsRemoveListError = action?.payload?.msg || 'error';
      });

    builder
      .addCase(customerDetailsAffiliateListApi.pending, (state) => {
        state.affiliateGroupApiState = 'pending';
        state.affiliateGroupLoading = true;
        state.affiliateGroupError = null;
      })

      .addCase(customerDetailsAffiliateListApi.fulfilled, (state, action) => {
        state.affiliateGroupApiState = action?.payload?.status || 'success';
        state.affiliateGroups = action?.payload?.data || [];
        state.affiliateGroupLoading = false;
        state.affiliateGroupError = action?.payload?.msg || 'error';
      })

      .addCase(customerDetailsAffiliateListApi.rejected, (state, action) => {
        state.affiliateGroupApiState = action?.payload?.status || 'error';
        state.affiliateGroupLoading = false;
        state.affiliateGroupError = action?.payload?.msg || 'error';
      });

    builder
      .addCase(customerDetailsGetAffiliateGroupListApi.pending, (state) => {
        state.getAffiliateGroupListApiState = 'pending';
        state.getAffiliateGroupListLoading = true;
        state.getAffiliateGroupListError = null;
      })

      .addCase(
        customerDetailsGetAffiliateGroupListApi.fulfilled,
        (state, action) => {
          state.getAffiliateGroupListApiState =
            action?.payload?.status || 'success';
          state.getAffiliateGroupList = action?.payload?.data || [];
          state.getAffiliateGroupListLoading = false;
          state.getAffiliateGroupListError = action?.payload?.msg || 'error';
        }
      )

      .addCase(
        customerDetailsGetAffiliateGroupListApi.rejected,
        (state, action) => {
          state.getAffiliateGroupListApiState =
            action?.payload?.status || 'error';
          state.getAffiliateGroupListLoading = false;
          state.getAffiliateGroupListError = action?.payload?.msg || 'error';
        }
      );

    builder
      .addCase(customerDetailsUpdateAffiliateGroupApi.pending, (state) => {
        state.customerDetailsUpdateAffiliateGroupApiState = 'pending';
        state.customerDetailsUpdateAffiliateGroupLoading = true;
        state.customerDetailsUpdateAffiliateGroupError = null;
      })

      .addCase(
        customerDetailsUpdateAffiliateGroupApi.fulfilled,
        (state, action) => {
          state.customerDetailsUpdateAffiliateGroupApiState =
            action?.payload?.status || 'success';
          state.customerDetailsUpdateAffiliateGroupLoading = false;
          state.customerDetailsUpdateAffiliateGroupError =
            action?.payload?.msg || 'error';
        }
      )
      .addCase(
        customerDetailsUpdateAffiliateGroupApi.rejected,
        (state, action) => {
          state.customerDetailsUpdateAffiliateGroupApiState =
            action?.payload?.status || 'error';
          state.customerDetailsUpdateAffiliateGroupLoading = false;
          state.customerDetailsUpdateAffiliateGroupError =
            action?.payload?.msg || 'error';
        }
      );
    builder
      .addCase(customerDetailsAssignGroupApi.pending, (state) => {
        state.customerDetailsAssignAffiliateGroupApiState = 'pending';
        state.customerDetailsAssignAffiliateGroupLoading = true;
        state.customerDetailsAssignAffiliateGroupError = null;
      })

      .addCase(customerDetailsAssignGroupApi.fulfilled, (state, action) => {
        state.customerDetailsAssignAffiliateGroupApiState =
          action?.payload?.status || 'success';

        state.customerDetailsAssignAffiliateGroupLoading = false;
        state.customerDetailsAssignAffiliateGroupError =
          action?.payload?.msg || 'error';
      })
      .addCase(customerDetailsAssignGroupApi.rejected, (state, action) => {
        state.customerDetailsAssignAffiliateGroupApiState =
          action?.payload?.status || 'error';
        state.customerDetailsAssignAffiliateGroupLoading = false;
        state.customerDetailsUpdateAcustomerDetailsAssignAffiliateGroupErrorffiliateGroupError =
          action?.payload?.msg || 'error';
      });

    builder
      .addCase(getVisitedProductList.pending, (state) => {
        state.visitedProductsLoading = true;
      })
      .addCase(getVisitedProductList.fulfilled, (state, action) => {
        state.visitedProductsLoading = false;

        const rows = action.payload.productVisitedLogRows || [];
        const currentPage = Number(action.payload.currentPage || 1);
        const totalPages = Number(action.payload.totalpages || 1);

        if (currentPage === 1) {
          state.visitedProducts = rows;
        } else {
          state.visitedProducts = [...state.visitedProducts, ...rows];
        }

        state.visitedProductsPage = currentPage;
        state.visitedProductsTotalPages = totalPages;
      })
      .addCase(getVisitedProductList.rejected, (state) => {
        state.visitedProductsLoading = false;
      });
  },
});

export const {
  updateCustomFieldValue,
  updateEmailUnsubscribeState,
  resetEmailUpdateStatus,
  updateCustomerStatusLocal,
  updateCustomerStatusReset,
  addMembershipPlanReset,
  createLisCustomerDetailstReset,
  customerDetailsRemoveListReset,
  customerDetailsUpdateAffiliateGroupReset,
  customerDetailsAssignGroupReset,
} = customerDetailsSlice.actions;

export default customerDetailsSlice.reducer;
