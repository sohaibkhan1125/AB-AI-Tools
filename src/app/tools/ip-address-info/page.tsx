
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Network, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface IpInfo {
  query: string;
  status: string;
  country?: string;
  countryCode?: string;
  regionName?: string;
  city?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  isp?: string;
  org?: string;
  as?: string;
  message?: string; // For errors from ip-api
}

const IPInfoDisplay: React.FC<{ info: IpInfo | null; title: string }> = ({ info, title }) => {
  if (!info) return null;
  if (info.status === 'fail') {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{info.message || 'Could not fetch IP information.'}</AlertDescription>
      </Alert>
    );
  }

  const displayFields: (keyof IpInfo)[] = ['query', 'country', 'regionName', 'city', 'isp', 'org', 'lat', 'lon', 'timezone'];
  const fieldLabels: Record<keyof IpInfo, string> = {
    query: 'IP Address',
    country: 'Country',
    regionName: 'Region',
    city: 'City',
    isp: 'ISP',
    org: 'Organization',
    lat: 'Latitude',
    lon: 'Longitude',
    timezone: 'Timezone',
    status: 'Status', // Not typically displayed directly
  };


  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayFields.map(key => 
          info[key] ? (
            <div key={key} className="flex justify-between text-sm">
              <span className="font-medium text-muted-foreground">{fieldLabels[key] || key}:</span>
              <span className="text-foreground text-right">{String(info[key])}</span>
            </div>
          ) : null
        )}
      </CardContent>
    </Card>
  );
};


const LoadingSkeleton = () => (
  <div className="mt-6 space-y-3">
    <Skeleton className="h-8 w-1/2" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
  </div>
)


export default function IpAddressInfoPage() {
  const [currentIpInfo, setCurrentIpInfo] = useState<IpInfo | null>(null);
  const [lookupIpInfo, setLookupIpInfo] = useState<IpInfo | null>(null);
  const [lookupIp, setLookupIp] = useState('');
  const [isLoadingCurrent, setIsLoadingCurrent] = useState(true);
  const [isLoadingLookup, setIsLoadingLookup] = useState(false);
  const [errorCurrent, setErrorCurrent] = useState<string | null>(null);
  const [errorLookup, setErrorLookup] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchIpInfo = useCallback(async (ipAddress?: string) => {
    const isCurrentIpLookup = !ipAddress;
    if (isCurrentIpLookup) {
      setIsLoadingCurrent(true);
      setErrorCurrent(null);
    } else {
      setIsLoadingLookup(true);
      setErrorLookup(null);
      setLookupIpInfo(null); // Clear previous lookup results
    }

    try {
      const response = await fetch(`https://ip-api.com/json/${ipAddress || ''}?fields=status,message,query,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as`);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data: IpInfo = await response.json();

      if (data.status === 'success') {
        if (isCurrentIpLookup) {
          setCurrentIpInfo(data);
        } else {
          setLookupIpInfo(data);
        }
      } else {
        const errorMessage = data.message || 'Failed to fetch IP information.';
        if (isCurrentIpLookup) {
          setErrorCurrent(errorMessage);
          setCurrentIpInfo({ query: '', status: 'fail', message: errorMessage });
        } else {
          setErrorLookup(errorMessage);
          setLookupIpInfo({ query: ipAddress || '', status: 'fail', message: errorMessage });
        }
        toast({ variant: 'destructive', title: 'API Error', description: errorMessage });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      if (isCurrentIpLookup) {
        setErrorCurrent(errorMessage);
         setCurrentIpInfo({ query: '', status: 'fail', message: errorMessage });
      } else {
        setErrorLookup(errorMessage);
        setLookupIpInfo({ query: ipAddress || '', status: 'fail', message: errorMessage });
      }
      toast({ variant: 'destructive', title: 'Fetch Error', description: errorMessage });
    } finally {
      if (isCurrentIpLookup) {
        setIsLoadingCurrent(false);
      } else {
        setIsLoadingLookup(false);
      }
    }
  }, [toast]);

  useEffect(() => {
    fetchIpInfo(); // Fetch current IP on initial load
  }, [fetchIpInfo]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupIp.trim()) {
      toast({ variant: 'destructive', title: 'Input Required', description: 'Please enter an IP address to look up.' });
      return;
    }
    // Basic IP validation regex (simplified for client-side check)
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(lookupIp.trim())) {
        toast({ variant: 'destructive', title: 'Invalid IP Format', description: 'Please enter a valid IPv4 address.' });
        return;
    }
    fetchIpInfo(lookupIp.trim());
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Network className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">IP Address Information</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            View details about your IP or look up information for any IP address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-1 font-headline">Your Current IP Information</h2>
             <p className="text-sm text-muted-foreground mb-4">This information is based on the public IP address your device is currently using.</p>
            {isLoadingCurrent && <LoadingSkeleton />}
            {!isLoadingCurrent && errorCurrent && (
              <Alert variant="destructive">
                <AlertTitle>Error Fetching Your IP</AlertTitle>
                <AlertDescription>{errorCurrent}</AlertDescription>
              </Alert>
            )}
            {!isLoadingCurrent && currentIpInfo && <IPInfoDisplay info={currentIpInfo} title="Details for Your IP" />}
          </section>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 font-headline">Lookup IP Address</h2>
            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <Label htmlFor="ipInput" className="font-medium">Enter IP Address</Label>
                <Input
                  id="ipInput"
                  type="text"
                  value={lookupIp}
                  onChange={(e) => setLookupIp(e.target.value)}
                  placeholder="e.g., 8.8.8.8"
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoadingLookup}>
                {isLoadingLookup ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Search className="mr-2 h-5 w-5" />
                )}
                {isLoadingLookup ? 'Looking up...' : 'Lookup IP'}
              </Button>
            </form>
            {isLoadingLookup && !lookupIpInfo && <LoadingSkeleton />}
            {!isLoadingLookup && errorLookup && !lookupIpInfo && (
                 <Alert variant="destructive" className="mt-4">
                    <AlertTitle>Lookup Error</AlertTitle>
                    <AlertDescription>{errorLookup}</AlertDescription>
                </Alert>
            )}
            {lookupIpInfo && <IPInfoDisplay info={lookupIpInfo} title={`Details for ${lookupIpInfo.query}`} />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

