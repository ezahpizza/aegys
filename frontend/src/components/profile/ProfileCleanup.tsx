import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { cleanupUserFiles } from "../../api/userApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, Eye, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CleanupResponse } from "../../types/apiTypes";

interface ProfileCleanupProps {
  userId: string;
}

export default function ProfileCleanup({ userId }: ProfileCleanupProps) {
  const [lastCleanupResult, setLastCleanupResult] = useState<CleanupResponse | null>(null);
  const { toast } = useToast();

  const previewMutation = useMutation({
    mutationFn: () => cleanupUserFiles(userId, true),
    onSuccess: (data) => {
      setLastCleanupResult(data);
      toast({
        title: "Cleanup Preview Complete",
        description: `Found ${data.expired_files} expired files to clean up.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Preview Failed", 
        description: error?.response?.data?.detail || "Failed to preview cleanup",
        variant: "destructive",
      });
    },
  });

  const cleanupMutation = useMutation({
    mutationFn: () => cleanupUserFiles(userId, false),
    onSuccess: (data) => {
      setLastCleanupResult(data);
      toast({
        title: "Cleanup Complete",
        description: `Successfully deleted ${data.deleted_from_storage || 0} files.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Cleanup Failed",
        description: error?.response?.data?.detail || "Failed to cleanup files",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trash2 className="h-5 w-5" />
            <span>File Cleanup</span>
          </CardTitle>
          <CardDescription>
            Remove expired warranty files to free up storage space. Preview changes before applying them.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => previewMutation.mutate()}
              disabled={previewMutation.isPending}
              className="flex items-center space-x-2 bg-midblck hover:bg-raspink"
            >
              <Eye className="h-4 w-4" />
              <span>{previewMutation.isPending ? "Previewing..." : "Preview Cleanup"}</span>
            </Button>

            <Button
              onClick={() => cleanupMutation.mutate()}
              disabled={cleanupMutation.isPending || !lastCleanupResult || lastCleanupResult.expired_files === 0}
              variant="destructive"
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>{cleanupMutation.isPending ? "Cleaning..." : "Run Cleanup"}</span>
            </Button>
          </div>

          {lastCleanupResult && (
            <Alert className={lastCleanupResult.cleanup_completed ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}>
              <div className="flex items-center space-x-2">
                {lastCleanupResult.cleanup_completed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                )}
                <AlertDescription className="flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {lastCleanupResult.cleanup_completed ? "Cleanup Completed" : "Cleanup Preview"}
                      </span>
                      <Badge variant={lastCleanupResult.dry_run ? "secondary" : "destructive"}>
                        {lastCleanupResult.dry_run ? "Preview" : "Executed"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Files:</span>
                        <span className="ml-2 font-medium">{lastCleanupResult.total_files}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expired Files:</span>
                        <span className="ml-2 font-medium text-orange-600">{lastCleanupResult.expired_files}</span>
                      </div>
                      {lastCleanupResult.deleted_from_storage !== undefined && (
                        <>
                          <div>
                            <span className="text-muted-foreground">Deleted from Storage:</span>
                            <span className="ml-2 font-medium text-green-600">{lastCleanupResult.deleted_from_storage}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Deleted from Database:</span>
                            <span className="ml-2 font-medium text-green-600">{lastCleanupResult.deleted_from_db}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {lastCleanupResult.files_to_delete.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Files to be deleted:</p>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {lastCleanupResult.files_to_delete.map((filename, index) => (
                            <div key={index} className="text-xs bg-white/50 rounded px-2 py-1">
                              {filename}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card className="bg-raspink border-none">
        <CardHeader>
          <CardTitle>Cleanup Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-white">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-midblu mt-2 flex-shrink-0"></div>
            <p>Only files with expired warranties will be deleted</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-midblu mt-2 flex-shrink-0"></div>
            <p>Preview cleanup first to see what will be deleted</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-midblu mt-2 flex-shrink-0"></div>
            <p>Deleted files cannot be recovered</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-midblu mt-2 flex-shrink-0"></div>
            <p>Cleanup helps free up storage space</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
