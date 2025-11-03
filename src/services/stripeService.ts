import {fetchWithTimeout} from '../utils/fetchWithTimeout';

// Types
export interface StripePlan {
  price_id: string;
  unit_amount: number;
  currency: string;
  interval: 'month' | 'year';
  interval_count: number;
  trial_period_days: number | null;
  nickname: string;
}

export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  active: boolean;
  images: string[];
  metadata: Record<string, any>;
  plans: StripePlan[];
}

export interface PlanSelectionResponse {
  plan_name: string;
  plan_description: string;
  amount: number;
  currency: string;
  interval: string;
  can_skip_for_discount: boolean;
  discount_percent: number;
  discount_amount: number;
  final_amount_with_discount: number;
  needs_customer: boolean;
  stripe_customer_id: string | null;
}

export interface SubscriptionData {
  id: string;
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';
  plan_name: string;
  plan_description: string;
  amount: number;
  currency: string;
  interval: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  payment_method: string;
}

export interface MySubscriptionResponse {
  has_subscription: boolean;
  can_use_trial: boolean;
  trial_status: 'available' | 'active' | 'used';
  is_in_trial?: boolean;
  trial_days_remaining?: number | null;
  subscription: SubscriptionData | null;
}

// Service functions
export const stripeService = {
  /**
   * 1. Obtener todos los planes disponibles
   */
  async getPlans(token: string): Promise<StripeProduct[]> {
    const response = await fetchWithTimeout(
      '/api/payments/products/plans/',
      {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener planes');
    }

    const data = await response.json();
    return data.data;
  },

  /**
   * 2. Seleccionar un plan (devuelve info del plan + opciones de trial/descuento)
   */
  async selectPlan(
    token: string,
    priceId: string,
  ): Promise<PlanSelectionResponse> {
    const response = await fetchWithTimeout(
      '/api/payments/select-plan-trial/',
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({price_id: priceId}),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al seleccionar plan');
    }

    const data = await response.json();
    return data.data;
  },

  /**
   * 3. Preparar el customer en Stripe (crear si no existe)
   */
  async preparePayment(token: string): Promise<{
    stripe_customer_id: string;
    customer_email: string;
    has_payment_methods: boolean;
    payment_methods: any[];
    selected_plan: any;
  }> {
    const response = await fetchWithTimeout(
      '/api/payments/prepare-payment/',
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al preparar pago');
    }

    const data = await response.json();
    return data.data;
  },

  /**
   * 4A. Skip trial y aplicar descuento (cobra HOY con 10% off)
   */
  async skipTrialWithDiscount(
    token: string,
    paymentMethodId: string,
  ): Promise<{
    subscription_id: string;
    plan_name: string;
    original_amount: number;
    discount_amount: number;
    final_amount: number;
    discount_percent: number;
  }> {
    const response = await fetchWithTimeout(
      '/api/payments/skip-trial-discount/',
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({payment_method_id: paymentMethodId}),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al procesar pago');
    }

    const data = await response.json();
    return data.data;
  },

  /**
   * 4B. Iniciar free trial de 7 días (NO cobra HOY)
   */
  async startTrial(
    token: string,
    paymentMethodId: string,
  ): Promise<{
    subscription_id: string;
    plan_name: string;
    trial_ends_at: string;
    trial_days_remaining: number;
  }> {
    const response = await fetchWithTimeout(
      '/api/payments/start-trial/',
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({payment_method_id: paymentMethodId}),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al iniciar trial');
    }

    const data = await response.json();
    return data.data;
  },

  /**
   * 5. Consultar el estado de la suscripción actual
   */
  async getMySubscription(token: string): Promise<MySubscriptionResponse> {
    const response = await fetchWithTimeout(
      '/api/payments/my-subscription/',
      {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener suscripción');
    }

    return await response.json();
  },

  /**
   * 6. Cancelar suscripción
   */
  async cancelSubscription(
    token: string,
    cancelAtPeriodEnd: boolean = true,
  ): Promise<{
    subscription_id: string;
    status: string;
    cancel_at_period_end: boolean;
  }> {
    const response = await fetchWithTimeout(
      '/api/payments/subscriptions/cancel/',
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({cancel_at_period_end: cancelAtPeriodEnd}),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al cancelar suscripción');
    }

    const data = await response.json();
    return data.subscription;
  },
};
