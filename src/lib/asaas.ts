export const ASAAS_API_KEY = process.env.ASAAS_API_KEY!;
export const ASAAS_BASE_URL = process.env.ASAAS_BASE_URL || 'https://api.asaas.com/v3';

export async function createCustomer(email: string, cpfCnpj: string) {
  const res = await fetch(`${ASAAS_BASE_URL}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access_token': ASAAS_API_KEY,
    },
    body: JSON.stringify({
      name: 'Cliente Criador de Logomarca',
      email: email,
      cpfCnpj: cpfCnpj,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Asaas createCustomer error: ${text}`);
  }

  return res.json();
}

export async function createPixPayment(customerId: string, value: number, externalReference: string) {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 1); // tomorrow

  const res = await fetch(`${ASAAS_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access_token': ASAAS_API_KEY,
    },
    body: JSON.stringify({
      customer: customerId,
      billingType: 'PIX',
      value,
      dueDate: dueDate.toISOString().split('T')[0],
      description: 'Compra de Logotipo Exclusivo',
      externalReference,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Asaas createPayment error: ${text}`);
  }

  return res.json();
}

export async function getPixQrCode(paymentId: string) {
  const res = await fetch(`${ASAAS_BASE_URL}/payments/${paymentId}/pixQrCode`, {
    method: 'GET',
    headers: {
      'access_token': ASAAS_API_KEY,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Asaas getPixQrCode error: ${text}`);
  }

  return res.json();
}
