import axiosClient from '@/utils/axios';

export const getWebhookModulesAndEventsService = async (payload) => {
  const response = await axiosClient(
    `/webhook-subscriptions/events`,
    payload,
    'POST',
    '',
    process.env.NEXT_PUBLIC_WEBHOOKS_API_ENDPOINT
  );
  return response;
};

export const getWebhooksListService = async (payload) => {
  const response = await axiosClient(
    `/webhook-subscriptions`,
    payload,
    'POST',
    '',
    process.env.NEXT_PUBLIC_WEBHOOKS_API_ENDPOINT
  );
  return response;
};

export const getWebhookDetailsService = async (payload) => {
  const response = await axiosClient(
    `/webhook-subscriptions/detail`,
    payload,
    'POST',
    '',
    process.env.NEXT_PUBLIC_WEBHOOKS_API_ENDPOINT
  );
  return response;
};

export const createWebhookService = async (payload) => {
  const response = await axiosClient(
    `/webhook-subscriptions/create`,
    payload,
    'POST',
    '',
    process.env.NEXT_PUBLIC_WEBHOOKS_API_ENDPOINT
  );
  return response;
};

export const updateWebhookService = async (payload) => {
  const response = await axiosClient(
    `/webhook-subscriptions/update`,
    payload,
    'POST',
    '',
    process.env.NEXT_PUBLIC_WEBHOOKS_API_ENDPOINT
  );
  return response;
};

export const deleteWebhookService = async (payload) => {
  const response = await axiosClient(
    `/webhook-subscriptions/delete`,
    payload,
    'POST',
    '',
    process.env.NEXT_PUBLIC_WEBHOOKS_API_ENDPOINT
  );
  return response;
};

export const sendTestEventService = async (payload) => {
  const response = await axiosClient(
    `/webhook-subscriptions/send-test-event`,
    payload,
    'POST',
    '',
    process.env.NEXT_PUBLIC_WEBHOOKS_API_ENDPOINT
  );
  return response;
};
