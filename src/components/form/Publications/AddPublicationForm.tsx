"use client";

import React, { useState, DragEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/redux/store";
import { showApiError, showError, showSuccess } from "@/lib/utils/toast";
import Button from "@/components/ui/button/Button";
import { Upload } from "lucide-react";
import { createPublication, editPublication, getPublications } from "@/store/redux/slice/publicationSlice";
import { MESSAGES } from "@/components/common/constants/utlis";
import { SelectedPublication } from "@/types/publicationTypes";
import { getCertificateViewerHref } from "@/utils/certificateUrl";


interface PublicationFormProps {
    closeModal?: () => void;
    publicationId?: number;
    selectedPublication?:SelectedPublication;
}

export default function AddPublicationForm({
    closeModal,
    publicationId,
    selectedPublication,
}: PublicationFormProps) {
    const dispatch = useDispatch<AppDispatch>();
    const {  loading } = useSelector(
        (state: RootState) => state.publications
    );

    const [pdf, setPdf] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const currentPdfUrl = selectedPublication
        ? getCertificateViewerHref(selectedPublication)
        : "";

    const handleFileSelect = (file: File) => {
        if (file.type !== "application/pdf") {
            showError(MESSAGES.PDF);
            return;
        }
        setPdf(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (publicationId) {
                await dispatch(
                    editPublication({
                        id: publicationId,
                        payload: pdf ? { file: pdf } : {},
                    })
                ).unwrap();
                showSuccess(MESSAGES.EDIT_SUCCESS);
            } else {
                if (!pdf) return showError(MESSAGES.PDF_SELECTED);
                await dispatch(createPublication({ pdf })).unwrap();
                showSuccess(MESSAGES.ADD_SUCCESS);
            }

            await dispatch(getPublications());
            closeModal?.();
            setPdf(null);
        } catch (err: unknown) {
            showApiError(err, MESSAGES.PDF_ERROR);
        }
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-6 mt-2">
            <h2 className="text-xl font-semibold text-center">
                {publicationId ? "Edit Certificate" : "Upload Form"}
            </h2>
            <div
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg h-40 cursor-pointer transition ${dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
                    }`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                {!pdf ? (
                    <div className="flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                        <Upload className="w-8 h-8 mb-2" />
                        <span>
                            Drag & drop your PDF here or{" "}
                            <span className="text-blue-600">click to upload</span>
                        </span>
                    </div>
                ) : (
                    <p className="text-sm font-medium text-gray-700">{pdf.name}</p>
                )}

                <input
                    id="pdfInput"
                    type="file"
                    accept="application/pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                />
            </div>

            {publicationId && selectedPublication && !pdf && currentPdfUrl && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Current file:{" "}
                    <a
                        href={currentPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline dark:text-blue-400"
                    >
                        {selectedPublication.file_name || "View PDF"}
                    </a>
                </p>
            )}
            <div className="flex justify-end">
                <Button
                    type="submit"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading
                        ? publicationId
                            ? "Updating..."
                            : "Uploading..."
                        : publicationId
                            ? "Update"
                            : "Upload"}
                </Button>
            </div>
        </form>
    );
}
