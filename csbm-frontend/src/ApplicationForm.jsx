import React, { useState } from 'react';
import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION RULES
// ─────────────────────────────────────────────────────────────────────────────

const VALIDATORS = {
    // ── Step 1 ──
    fullName: (v) => {
        if (!v?.trim()) return 'Full name is required.';
        if (v.trim().length < 3) return 'Full name must be at least 3 characters.';
        if (!/^[a-zA-Z\s.'-]+$/.test(v.trim())) return 'Full name can only contain letters, spaces, hyphens, and apostrophes.';
        return null;
    },
    email: (v) => {
        if (!v?.trim()) return 'Email address is required.';
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(v.trim())) return 'Please enter a valid email address (e.g. john@example.com).';
        return null;
    },
    mobileNumber: (v) => {
        if (!v?.trim()) return 'Mobile number is required.';
        const str = v.trim();
        const digits = str.replace(/\D/g, '');
        if (str.startsWith('+94')) {
            if (digits.length !== 11 || !/^947\d{8}$/.test(digits)) {
                return 'Please enter a valid format (e.g. +94771234567).';
            }
        } else {
            if (digits.length !== 10 || !/^07\d{8}$/.test(digits)) {
                return 'Mobile number must be 10 digits and start with 07 (e.g. 0771234567).';
            }
        }
        return null;
    },
    address: (v) => {
        if (!v?.trim()) return 'Address is required.';
        if (v.trim().length < 10) return 'Please enter a more complete address (at least 10 characters).';
        return null;
    },

    // ── Step 2 ──
    targetProgram: (v) => (!v?.trim() ? 'Please select or enter your target program.' : null),
    stream: (v) => (!v?.trim() ? 'Please select your A/L stream.' : null),
    passes: (v) => {
        if (v === '' || v === null || v === undefined) return 'Number of passes is required.';
        const n = Number(v);
        if (isNaN(n) || !Number.isInteger(n)) return 'Passes must be a whole number.';
        if (n < 0 || n > 3) return 'Passes must be between 0 and 3.';
        return null;
    },
    qualification: (v) => (!v?.trim() ? 'Highest qualification is required.' : null),
    institution: (v) => {
        if (!v?.trim()) return 'Institution name is required.';
        if (v.trim().length < 3) return 'Please enter the full institution name.';
        return null;
    },
    gpa: (v) => {
        if (!v?.trim()) return 'GPA / final grade is required.';
        return null;
    },

    // ── Step 3 ──
    nicFile: (f) => {
        if (!f) return 'NIC / National Identity Card document is required.';
        if (f.size > 5 * 1024 * 1024) return 'NIC file must be smaller than 5 MB.';
        return null;
    },
    birthCertFile: (f) => {
        if (!f) return 'Birth Certificate document is required.';
        if (f.size > 5 * 1024 * 1024) return 'Birth Certificate must be smaller than 5 MB.';
        return null;
    },
    passportPhotoFile: (f) => {
        if (!f) return 'Passport-size photograph is required.';
        if (f.size > 2 * 1024 * 1024) return 'Passport photo must be smaller than 2 MB.';
        const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowed.includes(f.type)) return 'Passport photo must be a JPG or PNG image.';
        return null;
    },
    transcriptFile: (f) => {
        if (!f) return null; // optional
        if (f.size > 5 * 1024 * 1024) return 'Transcript must be smaller than 5 MB.';
        if (f.type !== 'application/pdf') return 'Transcript must be a PDF file.';
        return null;
    },
    digitalSignature: (v, formData) => {
        if (!v?.trim()) return 'Digital signature is required.';
        if (v.trim().length < 3) return 'Signature must be at least 3 characters.';
        if (
            formData?.fullName?.trim() &&
            v.trim().toLowerCase() !== formData.fullName.trim().toLowerCase()
        ) {
            return `Signature must match your full name exactly: "${formData.fullName.trim()}".`;
        }
        return null;
    },
};

// Fields belonging to each step (for step-gating)
const STEP_FIELDS = {
    1: ['fullName', 'email', 'mobileNumber', 'address'],
    2: ['targetProgram', 'stream', 'passes', 'qualification', 'institution', 'gpa'],
    3: ['nicFile', 'birthCertFile', 'passportPhotoFile', 'transcriptFile', 'digitalSignature'],
};

// Run validators for a given set of field keys
const validateFields = (keys, formData) => {
    const errs = {};
    keys.forEach((key) => {
        const fn = VALIDATORS[key];
        if (fn) {
            const result = key === 'digitalSignature' ? fn(formData[key], formData) : fn(formData[key]);
            if (result) errs[key] = result;
        }
    });
    return errs;
};

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE UI ATOMS
// ─────────────────────────────────────────────────────────────────────────────

const btnPrimary =
    'px-6 py-2.5 rounded-lg bg-[#135bec] hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none';
const btnSecondary =
    'px-6 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed';

/** Displays a red inline error message */
const FieldError = ({ msg }) =>
    msg ? (
        <p className="flex items-center gap-1 text-xs text-red-600 mt-1 font-medium">
            <span className="material-symbols-outlined text-xs leading-none">error</span>
            {msg}
        </p>
    ) : null;

/** Styled text input with error highlight */
const TextInput = ({ label, name, type = 'text', value, onChange, placeholder, error, required }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-slate-600">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`h-11 px-4 rounded-lg border text-slate-900 text-sm transition-all
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  placeholder:text-slate-400
                  ${error ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
        />
        <FieldError msg={error} />
    </div>
);

/** Styled select dropdown */
const SelectInput = ({ label, name, value, onChange, options, placeholder, error, required }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-slate-600">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`h-11 px-4 rounded-lg border text-slate-900 text-sm transition-all
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${error ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
        >
            <option value="">{placeholder}</option>
            {options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>
        <FieldError msg={error} />
    </div>
);

/**
 * Drag-and-drop style file upload zone.
 * onFileChange(file) — called when a new file is chosen; triggers Cloudinary upload in parent.
 * isUploading      — shows a spinner while the upload is in-flight.
 * uploadedUrl      — once uploaded, shows a ✓ confirmed chip.
 */
const FileUpload = ({ label, stateKey, accept, formData, updateFormData, error, required, onFileChange, isUploading, uploadedUrl }) => {
    const file = formData[stateKey];

    const handleChange = (e) => {
        const chosen = e.target.files[0] || null;
        updateFormData({ [stateKey]: chosen });
        if (chosen && onFileChange) onFileChange(chosen);
    };

    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-600">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div
                className={`relative flex items-center gap-3 border-2 border-dashed rounded-xl p-4 transition-all
                    ${isUploading
                        ? 'border-blue-300 bg-blue-50/60 cursor-not-allowed'
                        : uploadedUrl
                            ? 'border-emerald-400 bg-emerald-50'
                            : file
                                ? 'border-blue-400 bg-blue-50'
                                : error
                                    ? 'border-red-400 bg-red-50'
                                    : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/30'}`}
            >
                {/* Left icon / spinner */}
                {isUploading ? (
                    <svg className="animate-spin h-5 w-5 text-blue-500 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                ) : (
                    <span className={`material-symbols-outlined ${
                        uploadedUrl ? 'text-emerald-500'
                        : file       ? 'text-blue-500'
                        : error      ? 'text-red-400'
                        :              'text-slate-400'}`}>
                        {uploadedUrl ? 'cloud_done' : file ? 'task' : 'upload_file'}
                    </span>
                )}

                {/* Label area */}
                <div className="flex-1 min-w-0">
                    {isUploading ? (
                        <p className="text-xs font-semibold text-blue-600 animate-pulse">Uploading to cloud…</p>
                    ) : uploadedUrl ? (
                        <div>
                            <p className="text-xs font-semibold text-emerald-700 truncate">{file?.name}</p>
                            <p className="text-[10px] text-emerald-500 mt-0.5 font-medium">✓ Uploaded to Cloudinary</p>
                        </div>
                    ) : file ? (
                        <p className="text-xs font-semibold text-blue-700 truncate">{file.name}</p>
                    ) : (
                        <p className="text-xs text-slate-400">Click to upload &bull; {accept}</p>
                    )}
                </div>

                {/* Hidden file input */}
                <input
                    type="file"
                    accept={accept}
                    disabled={isUploading}
                    onChange={handleChange}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />

                {/* Clear button — hidden while uploading */}
                {file && !isUploading && (
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); updateFormData({ [stateKey]: null }); }}
                        className="text-slate-400 hover:text-red-500 transition-colors shrink-0 z-10"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                )}
            </div>
            <FieldError msg={error} />
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// STEP COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const Step1PersonalDetails = ({ formData, updateFormData, errors, onNext }) => (
    <div className="space-y-6">
        <div>
            <h2 className="text-xl font-bold text-slate-800">Personal Details</h2>
            <p className="text-sm text-slate-500 mt-0.5">Enter your personal contact information.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextInput
                label="Full Name" name="fullName" value={formData.fullName}
                onChange={(v) => updateFormData({ fullName: v })}
                placeholder="e.g. John Kumara Silva" required error={errors.fullName}
            />
            <TextInput
                label="Email Address" name="email" type="email" value={formData.email}
                onChange={(v) => updateFormData({ email: v })}
                placeholder="john@example.com" required error={errors.email}
            />
            <TextInput
                label="Mobile Number" name="mobileNumber" type="tel" value={formData.mobileNumber}
                onChange={(v) => updateFormData({ mobileNumber: v })}
                placeholder="+94 77 123 4567" required error={errors.mobileNumber}
            />
            <div className="md:col-span-1">
                <TextInput
                    label="Permanent Address" name="address" value={formData.address}
                    onChange={(v) => updateFormData({ address: v })}
                    placeholder="123 Main Street, Colombo 07" required error={errors.address}
                />
            </div>
        </div>
        <div className="flex justify-end pt-2">
            <button onClick={onNext} className={btnPrimary}>
                Continue <span className="material-symbols-outlined text-base align-middle ml-1">arrow_forward</span>
            </button>
        </div>
    </div>
);

const AL_STREAMS = [
    { value: 'Maths', label: 'Physical Science (Maths)' },
    { value: 'Bio', label: 'Biological Science' },
    { value: 'Commerce', label: 'Commerce' },
    { value: 'Arts', label: 'Arts' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Any', label: 'Other / Any' },
];

const Step2AcademicInfo = ({ formData, updateFormData, errors, onNext, onBack }) => (
    <div className="space-y-6">
        <div>
            <h2 className="text-xl font-bold text-slate-800">Academic Information</h2>
            <p className="text-sm text-slate-500 mt-0.5">Tell us about your academic background and desired program.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextInput
                label="Target Program" name="targetProgram" value={formData.targetProgram}
                onChange={(v) => updateFormData({ targetProgram: v })}
                placeholder="e.g. BSc Computer Science" required error={errors.targetProgram}
            />
            <SelectInput
                label="A/L Stream" name="stream" value={formData.stream}
                onChange={(v) => updateFormData({ stream: v })}
                options={AL_STREAMS} placeholder="Select your stream…" required error={errors.stream}
            />
            <SelectInput
                label="Number of A/L Passes" name="passes" value={formData.passes}
                onChange={(v) => updateFormData({ passes: v })}
                options={[
                    { value: '3', label: '3 Passes (S / C / B / A)' },
                    { value: '2', label: '2 Passes' },
                    { value: '1', label: '1 Pass' },
                    { value: '0', label: '0 Passes' },
                ]}
                placeholder="Select passes…" required error={errors.passes}
            />
            <TextInput
                label="Highest Qualification" name="qualification" value={formData.qualification}
                onChange={(v) => updateFormData({ qualification: v })}
                placeholder="e.g. GCE A/L Certificate" required error={errors.qualification}
            />
            <TextInput
                label="Institution Name" name="institution" value={formData.institution}
                onChange={(v) => updateFormData({ institution: v })}
                placeholder="e.g. Royal College, Colombo" required error={errors.institution}
            />
            <TextInput
                label="GPA / Final Grade" name="gpa" value={formData.gpa}
                onChange={(v) => updateFormData({ gpa: v })}
                placeholder="e.g. 3.8 / 4.0  or  AAB" required error={errors.gpa}
            />
        </div>
        <div className="flex justify-between pt-2">
            <button onClick={onBack} className={btnSecondary}>
                <span className="material-symbols-outlined text-base align-middle mr-1">arrow_back</span> Back
            </button>
            <button onClick={onNext} className={btnPrimary}>
                Continue <span className="material-symbols-outlined text-base align-middle ml-1">arrow_forward</span>
            </button>
        </div>
    </div>
);

const Step3Documents = ({ formData, updateFormData, errors, onBack, onSubmit, isSubmitting,
    onFileChange, uploadingFields, uploadedUrls }) => (
    <div className="space-y-6">
        <div>
            <h2 className="text-xl font-bold text-slate-800">Document Uploads</h2>
            <p className="text-sm text-slate-500 mt-0.5">Upload clear, legible copies. Max file size: 5 MB each.</p>
        </div>

        {/* Tip box */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 text-blue-700">
            <span className="material-symbols-outlined shrink-0 text-blue-500 mt-0.5">info</span>
            <p className="text-xs leading-relaxed">
                Accepted formats: <strong>PDF, JPG, PNG</strong>. Passport photo must be <strong>JPG/PNG ≤ 2 MB</strong>.
                Your digital signature <strong>must match your full name exactly</strong> as entered in Step 1.
            </p>
        </div>

        {/* Global uploading banner */}
        {Object.values(uploadingFields || {}).some(Boolean) && (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                <svg className="animate-spin h-4 w-4 text-blue-500 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <p className="text-xs font-semibold text-blue-700">Uploading document to Cloudinary — please wait before submitting…</p>
            </div>
        )}

        <div className="space-y-4">
            <FileUpload
                label="NIC / National Identity Card" stateKey="nicFile"
                accept=".pdf,.jpg,.jpeg,.png" formData={formData} updateFormData={updateFormData}
                error={errors.nicFile} required
                onFileChange={(f) => onFileChange('nicFile', f)}
                isUploading={uploadingFields?.nicFile}
                uploadedUrl={uploadedUrls?.nicFile}
            />
            <FileUpload
                label="Birth Certificate" stateKey="birthCertFile"
                accept=".pdf,.jpg,.jpeg,.png" formData={formData} updateFormData={updateFormData}
                error={errors.birthCertFile} required
                onFileChange={(f) => onFileChange('birthCertFile', f)}
                isUploading={uploadingFields?.birthCertFile}
                uploadedUrl={uploadedUrls?.birthCertFile}
            />
            <FileUpload
                label="Passport-Size Photograph" stateKey="passportPhotoFile"
                accept=".jpg,.jpeg,.png" formData={formData} updateFormData={updateFormData}
                error={errors.passportPhotoFile} required
                onFileChange={(f) => onFileChange('passportPhotoFile', f)}
                isUploading={uploadingFields?.passportPhotoFile}
                uploadedUrl={uploadedUrls?.passportPhotoFile}
            />
            <FileUpload
                label="Academic Transcripts (Optional — PDF only)" stateKey="transcriptFile"
                accept=".pdf" formData={formData} updateFormData={updateFormData}
                error={errors.transcriptFile}
                onFileChange={(f) => onFileChange('transcriptFile', f)}
                isUploading={uploadingFields?.transcriptFile}
                uploadedUrl={uploadedUrls?.transcriptFile}
            />
        </div>

        {/* Digital Signature */}
        <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-600">
                Digital Signature <span className="text-red-500">*</span>
                <span className="ml-2 text-xs font-normal text-slate-400">(Type your full name to confirm)</span>
            </label>
            <input
                type="text"
                value={formData.digitalSignature || ''}
                onChange={(e) => updateFormData({ digitalSignature: e.target.value })}
                placeholder={`Type: "${formData.fullName || 'Your Full Name'}"`}
                className={`h-11 px-4 rounded-lg border text-slate-900 text-sm italic transition-all
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    placeholder:text-slate-400
                    ${errors.digitalSignature ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
            />
            <FieldError msg={errors.digitalSignature} />
        </div>

        <div className="flex justify-between pt-2">
            <button onClick={onBack} disabled={isSubmitting} className={btnSecondary}>
                <span className="material-symbols-outlined text-base align-middle mr-1">arrow_back</span> Back
            </button>
            <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className={`${btnPrimary} min-w-[170px] flex items-center justify-center gap-2`}
            >
                {isSubmitting ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Submitting…
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-lg">send</span>
                        Submit Application
                    </>
                )}
            </button>
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// STEP CONFIG & INITIAL STATE
// ─────────────────────────────────────────────────────────────────────────────
const STEPS = [
    { id: 1, label: 'Personal Details', icon: 'person' },
    { id: 2, label: 'Academic Info', icon: 'history_edu' },
    { id: 3, label: 'Documents', icon: 'upload_file' },
];

const INITIAL_FORM_DATA = {
    fullName: '', email: '', mobileNumber: '', address: '',
    targetProgram: '', stream: '', passes: '', qualification: '', institution: '', gpa: '',
    nicFile: null, birthCertFile: null, passportPhotoFile: null, transcriptFile: null,
    digitalSignature: '',
};

// ─────────────────────────────────────────────────────────────────────────────
// PARENT WRAPPER — ApplicationForm
// ─────────────────────────────────────────────────────────────────────────────
const ApplicationForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState({});           // field-level errors
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | { error: string }

    // ── Cloudinary upload state ──────────────────────────────────────────────
    // Tracks which fields are currently being uploaded (shows spinner per field)
    const [uploadingFields, setUploadingFields] = useState({});
    // Stores the Cloudinary secure_url for each uploaded file field
    const [uploadedUrls, setUploadedUrls] = useState({});

    // ── Shared updater ──────────────────────────────────────────────────────
    const updateFormData = (fields) => {
        setFormData(prev => ({ ...prev, ...fields }));
        // Clear errors for changed fields in real-time
        const clearedErrors = {};
        Object.keys(fields).forEach(k => { clearedErrors[k] = undefined; });
        setErrors(prev => ({ ...prev, ...clearedErrors }));
    };

    // ── Validate current step & gate navigation ─────────────────────────────
    const validateStep = (step) => {
        const errs = validateFields(STEP_FIELDS[step], formData);
        setErrors(prev => ({ ...prev, ...errs }));
        return Object.keys(errs).length === 0;
    };

    const goNext = () => {
        if (validateStep(currentStep)) setCurrentStep(s => Math.min(s + 1, STEPS.length));
    };
    const goBack = () => {
        setErrors({});
        setCurrentStep(s => Math.max(s - 1, 1));
    };

    // ── Cloudinary unsigned upload ───────────────────────────────────────────
    /**
     * Uploads a single file to Cloudinary using the unsigned REST API.
     * @param {string} fieldKey  - The formData key (e.g. 'nicFile')
     * @param {File}   file      - The File object chosen by the user
     */
    const uploadToCloudinary = async (fieldKey, file) => {
        // Mark this field as uploading
        setUploadingFields(prev => ({ ...prev, [fieldKey]: true }));

        try {
            const data = new FormData();
            data.append('file', file);
            // ⚠️ Replace 'csbm_uploads' with your actual Cloudinary unsigned upload preset name
            data.append('upload_preset', 'csbm_uploads');

            // ⚠️ Replace 'dbcs7brme' with your actual Cloudinary cloud name
            // Using /auto/upload so both images (JPG/PNG) and PDFs are accepted
            const res = await fetch(
                'https://api.cloudinary.com/v1_1/dbcs7brme/auto/upload',
                { method: 'POST', body: data }
            );

            if (!res.ok) throw new Error(`Cloudinary error: ${res.status}`);

            const json = await res.json();
            const secureUrl = json.secure_url;

            // Store the returned URL against the field key
            setUploadedUrls(prev => ({ ...prev, [fieldKey]: secureUrl }));
        } catch (err) {
            console.error('Cloudinary upload failed:', err);
            // Surface the error so the user knows — treat as a field error
            setErrors(prev => ({ ...prev, [fieldKey]: 'Upload failed. Please try again.' }));
            // Clear the file selection so they can retry
            setFormData(prev => ({ ...prev, [fieldKey]: null }));
        } finally {
            setUploadingFields(prev => ({ ...prev, [fieldKey]: false }));
        }
    };

    // ── Final Submission ────────────────────────────────────────────────────
    const submitApplication = async () => {
        if (!validateStep(3)) return;

        // Block submission if any file is still uploading
        if (Object.values(uploadingFields).some(Boolean)) return;

        // Guard: required documents must have been uploaded to Cloudinary
        if (!uploadedUrls.nicFile || !uploadedUrls.birthCertFile || !uploadedUrls.passportPhotoFile) {
            setErrors(prev => ({
                ...prev,
                nicFile: !uploadedUrls.nicFile ? 'Please wait for the upload to finish.' : undefined,
                birthCertFile: !uploadedUrls.birthCertFile ? 'Please wait for the upload to finish.' : undefined,
                passportPhotoFile: !uploadedUrls.passportPhotoFile ? 'Please wait for the upload to finish.' : undefined,
            }));
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Send JSON — no raw files, only Cloudinary URLs
            // ✅ No multer needed on the backend for this endpoint anymore
            const payload = {
                fullName:         formData.fullName,
                email:            formData.email,
                mobileNumber:     formData.mobileNumber,
                address:          formData.address,
                course:           formData.targetProgram,   // backend field name
                stream:           formData.stream,
                passes:           formData.passes,
                qualification:    formData.qualification,
                institution:      formData.institution,
                gpa:              formData.gpa,
                digitalSignature: formData.digitalSignature,
                // Cloudinary secure URLs (strings, not File objects)
                nicUrl:           uploadedUrls.nicFile,
                birthCertUrl:     uploadedUrls.birthCertFile,
                passportPhotoUrl: uploadedUrls.passportPhotoFile,
                transcriptUrl:    uploadedUrls.transcriptFile || null,
            };

            await axios.post(
                'http://localhost:8080/api/applications/submit',
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            );

            // Reset everything on success
            setFormData(INITIAL_FORM_DATA);
            setUploadedUrls({});
            setUploadingFields({});
            setErrors({});
            setCurrentStep(1);
            setSubmitStatus('success');

        } catch (err) {
            const message =
                err.response?.data?.error ||
                err.response?.data?.details ||
                err.message ||
                'Something went wrong. Please try again.';
            setSubmitStatus({ error: message });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="bg-[#f6f6f8] min-h-screen font-sans py-10 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Page Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Application Form</h1>
                    <p className="text-slate-500 mt-2 text-sm">
                        Complete all three steps to submit your application.&nbsp;
                        <span className="text-red-500 font-semibold">*</span> Required fields.
                    </p>
                </div>

                {/* SUCCESS BANNER */}
                {submitStatus === 'success' && (
                    <div className="mb-8 flex flex-col items-center gap-4 bg-white border border-emerald-200
                          rounded-2xl p-8 shadow-lg shadow-emerald-50 text-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-emerald-500 text-4xl">check_circle</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-emerald-700">Application Submitted Successfully!</h2>
                            <p className="text-slate-500 mt-1 text-sm max-w-sm mx-auto">
                                We've received your application. A confirmation will be sent to your email shortly.
                            </p>
                        </div>
                        <button
                            onClick={() => setSubmitStatus(null)}
                            className="mt-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow transition-all"
                        >
                            Submit Another Application
                        </button>
                    </div>
                )}

                {/* ERROR BANNER (API error) */}
                {submitStatus?.error && (
                    <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                        <span className="material-symbols-outlined text-red-500 shrink-0 mt-0.5">error</span>
                        <div>
                            <p className="font-bold text-sm">Submission Failed</p>
                            <p className="text-sm mt-0.5">{submitStatus.error}</p>
                        </div>
                        <button
                            onClick={() => setSubmitStatus(null)}
                            className="ml-auto text-red-400 hover:text-red-600 transition-colors shrink-0"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>
                )}

                {/* MAIN FORM CARD */}
                {submitStatus !== 'success' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                        {/* Progress Stepper */}
                        <div className="px-8 pt-8 pb-6 border-b border-slate-100">
                            <div className="flex items-center justify-between relative">
                                <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 z-0" />
                                <div
                                    className="absolute top-5 left-0 h-0.5 bg-[#135bec] z-0 transition-all duration-500"
                                    style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                                />
                                {STEPS.map((step) => {
                                    const isCompleted = currentStep > step.id;
                                    const isActive = currentStep === step.id;
                                    return (
                                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center
                                      border-2 transition-all duration-300
                                      ${isCompleted ? 'bg-[#135bec] border-[#135bec] text-white'
                                                    : isActive ? 'bg-white border-[#135bec] text-[#135bec] shadow-md shadow-blue-100'
                                                        : 'bg-white border-slate-200 text-slate-400'}`}>
                                                {isCompleted
                                                    ? <span className="material-symbols-outlined text-lg">check</span>
                                                    : <span className="material-symbols-outlined text-lg">{step.icon}</span>
                                                }
                                            </div>
                                            <span className={`text-xs font-semibold hidden sm:block transition-colors
                                        ${isActive ? 'text-[#135bec]' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Step Content */}
                        <div className="p-8">
                            {currentStep === 1 && (
                                <Step1PersonalDetails
                                    formData={formData} updateFormData={updateFormData}
                                    errors={errors} onNext={goNext}
                                />
                            )}
                            {currentStep === 2 && (
                                <Step2AcademicInfo
                                    formData={formData} updateFormData={updateFormData}
                                    errors={errors} onNext={goNext} onBack={goBack}
                                />
                            )}
                            {currentStep === 3 && (
                                <Step3Documents
                                    formData={formData} updateFormData={updateFormData}
                                    errors={errors} onBack={goBack}
                                    onSubmit={submitApplication} isSubmitting={isSubmitting}
                                    onFileChange={uploadToCloudinary}
                                    uploadingFields={uploadingFields}
                                    uploadedUrls={uploadedUrls}
                                />
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-8 pb-6 flex justify-center border-t border-slate-50 pt-2">
                            <p className="text-xs text-slate-400 font-medium">Step {currentStep} of {STEPS.length}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicationForm;
