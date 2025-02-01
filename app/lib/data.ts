// import { sql } from '@vercel/postgres';
import {
    CustomerPageData, CustomersData, CustomersTableType,
    Invoice,
    InvoiceCount,
    InvoiceSearchData,
    InvoiceTable,
    LatestInvoice,
    User,
} from './definitions';
import {invoices, revenue} from "@/app/lib/placeholder-data";
import {formatCurrency} from "@/app/lib/utils";

const fetcher = (url: string | URL | Request) => fetch(url).then((r) => r.json())

export async function fetchRevenue() {
    try {

        // console.log('Fetching revenue data...');
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        const response = await fetch('http://localhost:8080/api/revenue')
        const data = await response.json()

        // console.log('Data fetch completed after 3 seconds.');


        console.log(data);

        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error('Failed to fetch revenue data.');
    }
}

export async function fetchLatestInvoices() {
    try {
        const response = await fetcher('http://localhost:8080/api/invoices') as LatestInvoice[]
        console.log(response);
        return response;
    } catch (error) {
        console.error('Fetch Error:', error);
        throw new Error('Failed to fetch the latest invoices.');
    }
}

export async function fetchCardData() {
    try {
        const invoiceCounts = await fetcher('http://localhost:8080/api/invoices/counts') as InvoiceCount
        const numberOfCustomers = await fetcher('http://localhost:8080/api/customers/counts') as number

        return {
            numberOfCustomers,
            invoiceCounts
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch card data.');
    }
}


const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(query: string, currentPage: number) {
    try {
        const url = `http://localhost:8080/api/invoices/search?query=${encodeURIComponent(query)}&page=${currentPage}&size=${ITEMS_PER_PAGE}`;
        return (await fetcher(url)) as InvoiceSearchData;
    } catch (error) {
        console.error('Fetch Error:', error);
        throw new Error('Failed to fetch invoices.');
    }
}

export async function saveInvoice(
    path: string,
    method: string,
    customerId: string,
    amount: number,
    status: string,
) {
    try {
        const url = `http://localhost:8080/api/invoices${path}`
        await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                customerId, // ES6 shorthand for `customerId: customerId`
                amount,
                status,
            }),
        }).then(() => {
                console.error('Creating invoice successfully');
            }
        ).catch((error) => {
            console.error('Fetch Error:', error);
            throw new Error('Failed to fetch invoices.');
        });
    } catch (error) {
        console.error('Fetch Error:', error);
        throw new Error('Failed to fetch invoices.');
    }
}

export async function deleteInvoiceById(
    path: string,
) {
    try {
        const url = `http://localhost:8080/api/invoices${path}`
        await fetch(url, {
            method: "DELETE",
        }).then(() => {
                console.error('Creating invoice successfully');
            }
        ).catch((error) => {
            console.error('Fetch Error:', error);
            throw new Error('Failed to fetch invoices.');
        });
    } catch (error) {
        console.error('Fetch Error:', error);
        throw new Error('Failed to fetch invoices.');
    }
}

export async function fetchInvoiceById(id: string) {
  try {
    return await fetcher(`http://localhost:8080/api/invoices/${id}`);
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
    try {
        const url = 'http://localhost:8080/api/customers?sort=name%2Casc'
        return await fetcher(url) as CustomerPageData;
    } catch (err) {
        console.error('Fetch Error:', err);
        throw new Error('Failed to fetch all customers.');
    }
}

export async function fetchLogin(email: string) {
    try {
        const user: User = {
            id: '12345',
            name: 'John Doe',
            email: 'user@nextmail.com',
            password: '123456',
        };
        return user
        // const url = 'http://localhost:8080/api/customers?sort=name%2Casc'
        // return await fetcher(url) as CustomerPageData;
    } catch (err) {
        console.error('Fetch Error:', err);
        throw new Error('Failed to fetch all customers.');
    }
}


export async function fetchFilteredCustomers(query: string) {
  try {
      const url = `http://localhost:8080/api/customers/search?query=${encodeURIComponent(query)}`;
    const data = await fetcher(url) as CustomersData;
    const customers = data.content.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
