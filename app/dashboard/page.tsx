"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import { fetchResumes, deleteResume } from "@/app/store/redux/resumeSlice";

import { Button } from "@/app/component/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/component/ui/card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/app/component/ui/alert-dialog";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const {
    items: resumes,
    loading,
    error,
  } = useSelector((state: RootState) => state.resumes);

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  const confirmDelete = () => {
    if (deleteId !== null) {
      dispatch(deleteResume(deleteId));
      setDeleteId(null);
    }
  };

  const sortedResumes = useMemo(() => {
    return [...resumes].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [resumes]);

  const lastUpdated = sortedResumes[0];
  const recentResumes = sortedResumes.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Dashboard
        </h1>

        <Link href="/resume/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition">
            + Create Resume
          </Button>
        </Link>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card className="bg-blue-50 border-blue-100">
          <CardHeader>
            <CardTitle>Total Resumes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{resumes.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-100">
          <CardHeader>
            <CardTitle>Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            {lastUpdated ? (
              <>
                <p className="font-semibold">{lastUpdated.title}</p>
                <p className="text-sm text-gray-600">
                  {new Date(lastUpdated.updatedAt).toLocaleString()}
                </p>
              </>
            ) : (
              <p className="text-gray-500">No resumes yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-100">
          <CardHeader>
            <CardTitle>Resumes with AI Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {resumes.filter((r) => r.aiToolsEnabled).length || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* RECENTLY UPDATED */}
      {recentResumes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recently Updated
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentResumes.map((r) => (
              <Card
                key={r.id}
                className="hover:shadow-lg transition-shadow duration-300 border border-gray-200"
              >
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-gray-800">
                    {r.title}
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(r.updatedAt).toLocaleString()}
                  </p>
                </CardHeader>

                <CardContent className="flex flex-wrap gap-2 mt-2">
                  <Link href={`/resume/${r.id}/edit`}>
                    <Button variant="outline" className="px-2 py-1 text-xs">
                      Edit
                    </Button>
                  </Link>

                  <Link href={`/resume/${r.id}/preview`}>
                    <Button className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white">
                      Preview
                    </Button>
                  </Link>

                  <Link href={`/resume/${r.id}/AItools`}>
                    <Button variant="secondary" className="px-2 py-1 text-xs">
                      AI Tools
                    </Button>
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="px-2 py-1 text-xs"
                        onClick={() => setDeleteId(r.id)}
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Resume?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your resume.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ALL RESUMES */}
      {loading ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse h-40 bg-gray-100 rounded-lg shadow-md"
            />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500 mt-6">{error}</p>
      ) : resumes.length === 0 ? (
        <p className="text-gray-500 mt-6">
          No resumes found. Create your first resume!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {sortedResumes.map((r) => (
            <Card
              key={r.id}
              className="hover:shadow-xl transition-shadow duration-300 border border-gray-200"
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {r.title}
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Updated: {new Date(r.updatedAt).toLocaleString()}
                </p>
              </CardHeader>

              <CardContent className="flex flex-wrap gap-2 mt-3">
                <Link href={`/resume/${r.id}/edit`}>
                  <Button variant="outline" className="px-3 py-1 text-sm">
                    Edit
                  </Button>
                </Link>

                <Link href={`/resume/${r.id}/preview`}>
                  <Button className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white">
                    Preview
                  </Button>
                </Link>

                <Link href={`/resume/${r.id}/AItools`}>
                  <Button variant="secondary" className="px-3 py-1 text-sm">
                    AI Tools
                  </Button>
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="px-3 py-1 text-sm"
                      onClick={() => setDeleteId(r.id)}
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Resume?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your resume.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={confirmDelete}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
