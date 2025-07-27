
'use server';
/**
 * @fileOverview Genkit flow for fetching IP address information.
 * - getIpInfo - Function to fetch geographic and network info for an IP address.
 * - IpInfoInput - Input type for the IP info flow.
 * - IpInfoOutput - Output type for the IP info flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IpInfoInputSchema = z.object({
  ipAddress: z.string().optional().describe('The IP address to look up. If empty, the API will use the caller\'s IP.'),
});
export type IpInfoInput = z.infer<typeof IpInfoInputSchema>;

// This schema must match the fields requested from the ip-api.com service.
const IpInfoOutputSchema = z.object({
  query: z.string(),
  status: z.string(),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  regionName: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  lat: z.number().optional(),
  lon: z.number().optional(),
  timezone: z.string().optional(),
  isp: z.string().optional(),
  org: z.string().optional(),
  as: z.string().optional(),
  message: z.string().optional(), // For error messages from the API
});
export type IpInfoOutput = z.infer<typeof IpInfoOutputSchema>;


const ipInfoFlow = ai.defineFlow(
  {
    name: 'ipInfoFlow',
    inputSchema: IpInfoInputSchema,
    outputSchema: IpInfoOutputSchema,
  },
  async (input) => {
    const { ipAddress } = input;
    const url = `http://ip-api.com/json/${ipAddress || ''}?fields=status,message,query,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        // Handle non-2xx responses by creating a structured error output
        const errorText = await response.text();
        return {
          query: ipAddress || 'Your IP',
          status: 'fail',
          message: `API request failed with status ${response.status}: ${errorText}`,
        };
      }
      
      const data: IpInfoOutput = await response.json();
      return data;

    } catch (error: any) {
      console.error('Error fetching IP info:', error);
      return {
        query: ipAddress || 'Your IP',
        status: 'fail',
        message: `Network error or invalid response from API: ${error.message}`,
      };
    }
  }
);

export async function getIpInfo(input: IpInfoInput): Promise<IpInfoOutput> {
  return ipInfoFlow(input);
}
