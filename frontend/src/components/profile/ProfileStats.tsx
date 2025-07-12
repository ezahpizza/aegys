import { useEffect } from "react";
import { useFilesStore } from "../../stores/filesStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Files, AlertTriangle, CheckCircle, XCircle, Clock, HardDrive } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileStatsProps {
  userId: string;
}

export default function ProfileStats({ userId }: ProfileStatsProps) {
  const { stats, expiring, loading, fetchStats, fetchExpiring } = useFilesStore();

  useEffect(() => {
    if (userId) {
      fetchStats(userId);
      fetchExpiring(userId);
    }
  }, [userId, fetchStats, fetchExpiring]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-5 w-8" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex-1 truncate">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-5 w-12" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const storageUsedMB = stats ? Math.round(stats.storage_usage / (1024 * 1024)) : 0;
  const storageProgress = Math.min((storageUsedMB / 100) * 100, 100); // Assuming 100MB limit

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-lavpink border-none text-midblck">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <Files className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_files || 0}</div>
            <p className="text-xs">
              Documents uploaded
            </p>
          </CardContent>
        </Card>

        <Card className="bg-perspink border-none text-midblck">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiring?.count || 0}</div>
            <p className="text-xs">
              Next 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-magpink border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed</CardTitle>
            <CheckCircle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.processed_files || 0}</div>
            <p className="text-xs">
              Successfully processed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-raspink border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storageUsedMB} MB</div>
            <Progress value={storageProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>File Status Overview</CardTitle>
            <CardDescription>Breakdown of your files by processing status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 min-h-[200px]">
            {stats?.files_by_status && Object.entries(stats.files_by_status).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {status === 'processed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {status === 'processing' && <Clock className="h-4 w-4 text-blue-500" />}
                  {status === 'failed' && <XCircle className="h-4 w-4 text-red-500" />}
                  {status === 'uploaded' && <Files className="h-4 w-4 text-gray-500" />}
                  <span className="capitalize text-sm font-medium">{status || 'Ready'}</span>
                </div>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expiring Warranties</CardTitle>
            <CardDescription>Warranties that need your attention</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[200px]">
            {expiring?.expiring_files && expiring.expiring_files.length > 0 ? (
              <div className="space-y-3">
                {expiring.expiring_files.slice(0, 5).map((file) => (
                  <div key={file._id} className="flex items-center justify-between text-sm">
                    <div className="flex-1 truncate">
                      <p className="font-medium text-midblck">
                        {file.warranty_data?.device_name || file.original_filename}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Expires: {file.warranty_data?.warranty_end ? 
                          new Date(file.warranty_data.warranty_end).toLocaleDateString() : 
                          'Unknown'
                        }
                      </p>
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      Soon
                    </Badge>
                  </div>
                ))}
                {expiring.expiring_files.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    And {expiring.expiring_files.length - 5} more...
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground text-center">
                  No expiring warranties found
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
