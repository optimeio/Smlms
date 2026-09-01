import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../state/useAuth';
import '../styles/Auth.css';

// Component to render photo/logo upload fields
const PhotoUploadComponent = ({ formType, fileVal, setFileFn, labelText = 'Upload Photo', fieldName = 'photo', fallbackInitial, error }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!fileVal) {
      setPreviewUrl(null);
      return;
    }
    try {
      const objectUrl = URL.createObjectURL(fileVal);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Error creating object URL", err);
      setPreviewUrl(null);
    }
  }, [fileVal]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
      <div style={{
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        border: error ? '2px dashed #ef4444' : '2px dashed #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : fallbackInitial ? (
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#FF6B00',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            fontWeight: 800
          }}>
            {fallbackInitial.trim().charAt(0).toUpperCase()}
          </div>
        ) : (
          <span style={{ fontSize: '32px', color: '#9CA3AF' }}>👤</span>
        )}
      </div>
      <label style={{
        cursor: 'pointer',
        padding: '6px 16px',
        borderRadius: '20px',
        border: '1px solid #E5E7EB',
        fontSize: '12px',
        fontWeight: 600,
        color: '#4B5563',
        backgroundColor: '#FFFFFF',
        textAlign: 'center'
      }}>
        {labelText}
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFileFn(e.target.files[0]);
            }
          }}
        />
      </label>
      {error && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '2px' }}>{error}</span>}
      <span style={{ fontSize: '10px', color: '#9CA3AF' }}>JPG, PNG (Max. 2MB)</span>
    </div>
  );
};


export default function Register() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type') || ''; 
  const [regType, setRegType] = useState(typeParam || 'student');

  useEffect(() => {
    if (typeParam) {
      setRegType(typeParam);
      setCurrentStep(0); // Reset step when type changes
    }
  }, [typeParam]);
  const [currentStep, setCurrentStep] = useState(0);

  // Success State
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP State for Trainer Email Verification
  const [showTrainerOTP, setShowTrainerOTP] = useState(false);
  const [isTrainerOTPVerified, setIsTrainerOTPVerified] = useState(false);
  const [trainerOTPCode, setTrainerOTPCode] = useState(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const otpInputRefs = useRef([]);

  // Phone OTP Verification States
  const [showPhoneOTP, setShowPhoneOTP] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phoneOTPCode, setPhoneOTPCode] = useState(Array(6).fill(''));
  const [phoneOtpError, setPhoneOtpError] = useState('');
  const [phoneOtpSuccess, setPhoneOtpSuccess] = useState('');
  const [isVerifyingPhoneOTP, setIsVerifyingPhoneOTP] = useState(false);
  const [isSendingPhoneOTP, setIsSendingPhoneOTP] = useState(false);

  // Signature canvas states
  const signatureCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const getCoordinates = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    return { x, y };
  };

  const startDrawing = (e) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    if (e.cancelable) {
      e.preventDefault();
    }
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0F172A';
    ctx.beginPath();
    const { x, y } = getCoordinates(e, canvas);
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    if (e.cancelable) {
      e.preventDefault();
    }
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
    handleTrainerChange('signatureAgreement', canvas.toDataURL());
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleTrainerChange('signatureAgreement', '');
  };

  const sendTrainerOTP = async (email) => {
    if (!email) {
      if (!showTrainerOTP) {
        setErrors(prev => ({ ...prev, email: 'Please enter an email address first.' }));
      } else {
        setOtpError('Please enter an email address first.');
      }
      return;
    }
    setIsSendingOTP(true);
    setOtpError('');
    setOtpSuccess('');
    setErrors(prev => ({ ...prev, email: null }));
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, isRegister: true })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSuccess(data.message || 'OTP sent successfully!');
        setShowTrainerOTP(true);
      } else {
        if (!showTrainerOTP) {
          setErrors(prev => ({ ...prev, email: data.message || 'Failed to send OTP.' }));
        } else {
          setOtpError(data.message || 'Failed to send OTP.');
        }
      }
    } catch (err) {
      console.error(err);
      if (!showTrainerOTP) {
        setErrors(prev => ({ ...prev, email: 'Error sending OTP. Please try again.' }));
      } else {
        setOtpError('Error sending OTP. Please try again.');
      }
    } finally {
      setIsSendingOTP(false);
    }
  };

  const verifyTrainerOTP = async () => {
    const code = trainerOTPCode.join('');
    if (code.length < 6) {
      setOtpError('Please enter all 6 digits.');
      return;
    }
    setIsVerifyingOTP(true);
    setOtpError('');
    setOtpSuccess('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trainerForm.email, otp: code })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSuccess('Email verified successfully!');
        setIsTrainerOTPVerified(true);
        setTimeout(() => {
          setShowTrainerOTP(false);
          setCurrentStep(1);
          setOtpSuccess('');
        }, 1000);
      } else {
        setOtpError(data.message || 'Incorrect OTP. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setOtpError('Error verifying OTP.');
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const sendPhoneOTP = async (email) => {
    if (!email) {
      setPhoneOtpError('Please enter an email address first.');
      return;
    }
    setIsSendingPhoneOTP(true);
    setPhoneOtpError('');
    setPhoneOtpSuccess('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, isRegister: true })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPhoneOtpSuccess(data.message || 'OTP sent successfully!');
        setShowPhoneOTP(true);
      } else {
        const errorMsg = data.message || 'Failed to send OTP.';
        setPhoneOtpError(errorMsg);
        setErrors(prev => ({ ...prev, general: errorMsg }));
      }
    } catch (err) {
      console.error(err);
      setPhoneOtpError('Error sending OTP. Please try again.');
      setErrors(prev => ({ ...prev, general: 'Error sending OTP. Please try again.' }));
    } finally {
      setIsSendingPhoneOTP(false);
    }
  };

  const verifyPhoneOTP = async (email) => {
    const code = phoneOTPCode.join('');
    if (code.length < 6) {
      setPhoneOtpError('Please enter all 6 digits.');
      return;
    }
    setIsVerifyingPhoneOTP(true);
    setPhoneOtpError('');
    setPhoneOtpSuccess('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPhoneOtpSuccess('Email verified successfully!');
        setIsPhoneVerified(true);
        setTimeout(() => {
          setShowPhoneOTP(false);
          setPhoneOtpSuccess('');
          handleSubmit();
        }, 1000);
      } else {
        setPhoneOtpError(data.message || 'Incorrect OTP. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setPhoneOtpError('Error verifying OTP.');
    } finally {
      setIsVerifyingPhoneOTP(false);
    }
  };

  // Form State
  const [studentForm, setStudentForm] = useState({
    photo: null,
    fullName: '',
    dob: '',
    gender: '',
    location: '',
    college: '',
    degree: '',
    department: '',
    gradYear: '',
    cgpa: '',
    skills: [],
    projectTitle: '',
    projectDesc: '',
    githubLink: '',
    linkedinLink: '',
    resume: 'Auto-Generated Resume',
    email: '',
    phone: '',
    address: '',
  });

  const [trainerForm, setTrainerForm] = useState({
    photo: null,
    fullName: '',
    gender: '',
    location: '',
    expertise: '',
    experienceYears: '',
    currentCompany: '',
    previousExp: '',
    summary: '',
    courseName: '',
    category: '',
    courseDesc: '',
    duration: '',
    level: '',
    teachingMode: '',
    resume: null,
    expCertificate: null,
    aadharCard: null,
    panCard: null,
    bankDetails: null,
    signatureAgreement: '',
    email: '',
    phone: '',
    address: '',
  });

  const [companyForm, setCompanyForm] = useState({
    logo: null,
    companyName: '',
    industry: '',
    website: '',
    location: '',
    companyDesc: '',
    jobRoles: '',
    requiredSkills: '',
    expRequired: '',
    companySize: '',
    workMode: '',
    hrName: '',
    hrDesignation: '',
    hrEmail: '',
    hrPhone: '',
    regCertificate: null,
    gstCertificate: null,
  });

  const [errors, setErrors] = useState({});

  // Skill Options
  const availableSkills = ['Python', 'Java', 'React', 'SQL', 'AI', 'Data Science'];

  // Handle Role Change
  const handleRoleChange = (role) => {
    setRegType(role);
    setCurrentStep(0);
    setErrors({});
  };

  // Student Step Definitions
  const studentSteps = [
    { title: 'Personal Details', description: 'Photo, name, location' },
    { title: 'Education Details', description: 'College, degree & CGPA' },
    { title: 'Skills & Projects', description: 'Core skillset & portfolio' },
    { title: 'Resume Generator', description: 'Auto-Generated Professional CV' },
    { title: 'Contact Info', description: 'Secure contact channels' }
  ];

  // Trainer Step Definitions
  const trainerSteps = [
    { title: 'Personal Details', description: 'Photo, name, location' },
    { title: 'Professional Details', description: 'Experience & credentials' },
    { title: 'Course Details', description: 'Curriculum & teaching mode' },
    { title: 'Verification Docs', description: 'Certificates & ID proofs' },
    { title: 'Contact Info', description: 'Verification & contact details' }
  ];

  // Company Step Definitions
  const companySteps = [
    { title: 'Company Details', description: 'Logo, industry & branding' },
    { title: 'Hiring Details', description: 'Talent criteria & size' },
    { title: 'HR Details', description: 'Contact HR representative' },
    { title: 'Verification Docs', description: 'Company legal papers' }
  ];

  const getSteps = () => {
    if (regType === 'student') return studentSteps;
    if (regType === 'trainer') return trainerSteps;
    return companySteps;
  };

  const steps = getSteps();

  // Field change handlers
  const handleStudentChange = (field, value) => {
    if (field === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setStudentForm(prev => ({ ...prev, [field]: value }));
    if (field === 'phone' || field === 'email') {
      setIsPhoneVerified(false);
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleTrainerChange = (field, value) => {
    if (field === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setTrainerForm(prev => ({ ...prev, [field]: value }));
    if (field === 'email') {
      setIsTrainerOTPVerified(false);
      setIsPhoneVerified(false);
    }
    if (field === 'phone') {
      setIsPhoneVerified(false);
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleCompanyChange = (field, value) => {
    if (field === 'hrPhone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setCompanyForm(prev => ({ ...prev, [field]: value }));
    if (field === 'hrPhone' || field === 'hrEmail') {
      setIsPhoneVerified(false);
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Toggle skills chips
  const toggleSkill = (skill) => {
    const currentSkills = studentForm.skills;
    if (currentSkills.includes(skill)) {
      handleStudentChange('skills', currentSkills.filter(s => s !== skill));
    } else {
      handleStudentChange('skills', [...currentSkills, skill]);
    }
  };

  // Validation Logic per step
  const validateCurrentStep = () => {
    const newErrors = {};
    if (regType === 'student') {
      if (currentStep === 0) {
        if (!studentForm.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!studentForm.dob) newErrors.dob = 'Date of birth is required';
        if (!studentForm.gender) newErrors.gender = 'Please select a gender';
        if (!studentForm.location.trim()) newErrors.location = 'Location is required';
      } else if (currentStep === 1) {
        if (!studentForm.college.trim()) newErrors.college = 'College name is required';
        if (!studentForm.degree) newErrors.degree = 'Please select a degree';
        if (!studentForm.department.trim()) newErrors.department = 'Department is required';
        if (!studentForm.gradYear) newErrors.gradYear = 'Graduation year is required';
        if (!studentForm.cgpa) newErrors.cgpa = 'CGPA is required';
      } else if (currentStep === 2) {
        if (studentForm.skills.length === 0) newErrors.skills = 'Select at least one skill';
        if (!studentForm.projectTitle.trim()) newErrors.projectTitle = 'Project title is required';
        if (!studentForm.projectDesc.trim()) newErrors.projectDesc = 'Project description is required';
      } else if (currentStep === 3) {
        // Resume is auto-generated, no validation block
      } else if (currentStep === 4) {
        if (!studentForm.email) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(studentForm.email)) {
          newErrors.email = 'Enter a valid email address';
        }
        if (!studentForm.phone) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(studentForm.phone)) {
          newErrors.phone = 'Enter a valid 10-digit phone number';
        }
        if (!studentForm.address.trim()) newErrors.address = 'Address is required';
      }
    } else if (regType === 'trainer') {
      if (currentStep === 0) {
        if (!trainerForm.photo) newErrors.photo = 'Profile photo is required';
        if (!trainerForm.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!trainerForm.gender) newErrors.gender = 'Please select a gender';
        if (!trainerForm.location.trim()) newErrors.location = 'Location is required';
        if (!trainerForm.email) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(trainerForm.email)) {
          newErrors.email = 'Enter a valid email address';
        }
      } else if (currentStep === 1) {
        if (!trainerForm.expertise.trim()) newErrors.expertise = 'Expertise is required';
        if (!trainerForm.experienceYears) newErrors.experienceYears = 'Years of Experience is required';
        if (!trainerForm.summary.trim()) newErrors.summary = 'Summary is required';
      } else if (currentStep === 2) {
        if (!trainerForm.courseName.trim()) newErrors.courseName = 'Course name is required';
        if (!trainerForm.category) newErrors.category = 'Course category is required';
        if (!trainerForm.duration.trim()) newErrors.duration = 'Duration is required';
        if (!trainerForm.level) newErrors.level = 'Course level is required';
        if (!trainerForm.teachingMode) newErrors.teachingMode = 'Teaching mode is required';
      } else if (currentStep === 3) {
        // Document file defaults are handled in the payload construction
        if (!trainerForm.signatureAgreement) {
          newErrors.signatureAgreement = 'Signature Agreement is required';
        }
      } else if (currentStep === 4) {
        if (!trainerForm.email) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(trainerForm.email)) {
          newErrors.email = 'Enter a valid email address';
        }
        if (!trainerForm.phone) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(trainerForm.phone)) {
          newErrors.phone = 'Enter a valid 10-digit phone number';
        }
        if (!trainerForm.address.trim()) newErrors.address = 'Address is required';
      }
    } else if (regType === 'company') {
      if (currentStep === 0) {
        if (!companyForm.companyName.trim()) newErrors.companyName = 'Company name is required';
        if (!companyForm.industry) newErrors.industry = 'Industry selection is required';
        if (!companyForm.website.trim()) newErrors.website = 'Website is required';
        if (!companyForm.location.trim()) newErrors.location = 'Location is required';
        if (!companyForm.companyDesc.trim()) newErrors.companyDesc = 'Company description is required';
      } else if (currentStep === 1) {
        if (!companyForm.jobRoles.trim()) newErrors.jobRoles = 'Target Job Roles are required';
        if (!companyForm.requiredSkills.trim()) newErrors.requiredSkills = 'Required skills are required';
        if (!companyForm.expRequired) newErrors.expRequired = 'Experience requirement is required';
        if (!companyForm.companySize) newErrors.companySize = 'Company size is required';
        if (!companyForm.workMode) newErrors.workMode = 'Work mode selection is required';
      } else if (currentStep === 2) {
        if (!companyForm.hrName.trim()) newErrors.hrName = 'HR Name is required';
        if (!companyForm.hrDesignation.trim()) newErrors.hrDesignation = 'HR Designation is required';
        if (!companyForm.hrEmail) {
          newErrors.hrEmail = 'HR Email is required';
        } else if (!/\S+@\S+\.\S+/.test(companyForm.hrEmail)) {
          newErrors.hrEmail = 'Enter a valid HR email address';
        }
        if (!companyForm.hrPhone) {
          newErrors.hrPhone = 'HR Phone number is required';
        } else if (!/^\d{10}$/.test(companyForm.hrPhone)) {
          newErrors.hrPhone = 'Enter a valid 10-digit phone number';
        }
      } else if (currentStep === 3) {
        // Certificates are optional — defaults are handled in the payload
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (regType === 'trainer' && currentStep === 0 && !isTrainerOTPVerified) {
        sendTrainerOTP(trainerForm.email);
        return;
      }
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        if (regType === 'trainer') {
          handleSubmit();
        } else {
          const email = regType === 'student' ? studentForm.email : companyForm.hrEmail;
          if (!isPhoneVerified) {
            sendPhoneOTP(email);
          } else {
            handleSubmit();
          }
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});
    
    const generateUniquePassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const nums = '0123456789';
      let randStr = '';
      for (let i = 0; i < 6; i++) {
        randStr += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      for (let i = 0; i < 4; i++) {
        randStr += nums.charAt(Math.floor(Math.random() * nums.length));
      }
      return `MBK_${randStr}`;
    };
    const uniquePassword = generateUniquePassword();

    let payload = {};
    if (regType === 'student') {
      payload = {
        ...studentForm,
        role: 'student',
        password: uniquePassword,
        confirmPassword: uniquePassword,
        resume: 'Auto-Generated Resume',
        photo: studentForm.photo ? studentForm.photo.name : '',
        district: studentForm.location || 'Salem',
        year: 'IV Year',
        isApproved: false // unapproved initially
      };
    } else if (regType === 'trainer') {
      payload = {
        ...trainerForm,
        role: 'trainer',
        password: uniquePassword,
        confirmPassword: uniquePassword,
        resume: trainerForm.resume ? trainerForm.resume.name : 'resume.pdf',
        photo: trainerForm.photo ? trainerForm.photo.name : '',
        expCertificate: trainerForm.expCertificate ? trainerForm.expCertificate.name : 'experience_certificate.pdf',
        aadharCard: trainerForm.aadharCard ? trainerForm.aadharCard.name : 'aadhar_card.pdf',
        panCard: trainerForm.panCard ? trainerForm.panCard.name : 'pan_card.pdf',
        bankDetails: trainerForm.bankDetails ? trainerForm.bankDetails.name : 'bank_details.pdf',
        signatureAgreement: trainerForm.signatureAgreement || 'Signed digitally',
        district: trainerForm.location || 'Salem',
        isApproved: false
      };
    } else {
      payload = {
        ...companyForm,
        role: 'company',
        fullName: companyForm.companyName,
        email: companyForm.hrEmail,
        phone: companyForm.hrPhone,
        password: uniquePassword,
        confirmPassword: uniquePassword,
        logo: companyForm.logo ? companyForm.logo.name : '',
        regCertificate: (companyForm.regCertificate && companyForm.regCertificate.name) ? companyForm.regCertificate.name : 'registration_certificate.pdf',
        gstCertificate: (companyForm.gstCertificate && companyForm.gstCertificate.name) ? companyForm.gstCertificate.name : 'gst_certificate.pdf',
        district: companyForm.location || 'Salem',
        isApproved: false
      };
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        const storedUser = data.user || {
          fullName: payload.fullName || payload.companyName || 'User',
          email: payload.email || payload.hrEmail,
          role: payload.role,
          isApproved: false
        };
        updateUser(storedUser);
        setIsSuccess(true);
      } else {
        let mappedErrors = { ...data.errors };
        if (regType === 'company') {
          if (data.errors && data.errors.fullName) mappedErrors.companyName = data.errors.fullName;
          if (data.errors && data.errors.email) mappedErrors.hrEmail = data.errors.email;
          if (data.errors && data.errors.phone) mappedErrors.hrPhone = data.errors.phone;
        }
        
        setErrors({ ...mappedErrors, general: data.message || 'Registration failed. Please check the form for errors.' });
      }
    } catch (err) {
      console.error(err);
      setErrors({ general: 'Failed to connect to backend server.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadResume = () => {
    if (!window.jspdf) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => generatePDFRegister();
      document.body.appendChild(script);
    } else {
      generatePDFRegister();
    }
  };

  const generatePDFRegister = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 107, 0); // Orange primary
    doc.text("MBK CarrierZ", 15, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Professional Career Profile Resume", 15, 25);
    doc.line(15, 28, 195, 28);

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(`Name: ${studentForm.fullName || 'Candidate'}`, 15, 40);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Email: ${studentForm.email || ''}`, 15, 48);
    doc.text(`Phone: ${studentForm.phone || ''}`, 15, 54);
    doc.text(`Location: ${studentForm.location || ''}, Tamil Nadu`, 15, 60);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 107, 0);
    doc.text("EDUCATION DETAILS", 15, 72);
    doc.line(15, 74, 195, 74);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(`College: ${studentForm.college || ''}`, 15, 82);
    doc.text(`Degree: ${studentForm.degree || ''}`, 15, 88);
    doc.text(`Department: ${studentForm.department || ''}`, 15, 94);
    doc.text(`Graduation Year: ${studentForm.gradYear || ''}`, 15, 100);
    doc.text(`CGPA: ${studentForm.cgpa || ''}`, 15, 106);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 107, 0);
    doc.text("TECHNICAL SKILLS", 15, 118);
    doc.line(15, 120, 195, 120);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(`Skills: ${(studentForm.skills || []).join(', ')}`, 15, 128);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 107, 0);
    doc.text("PROJECTS & ACCOMPLISHMENTS", 15, 140);
    doc.line(15, 142, 195, 142);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(`Project Title: ${studentForm.projectTitle || ''}`, 15, 150);
    doc.text(`Description: ${studentForm.projectDesc || ''}`, 15, 156);

    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text("Generated automatically via MBK CarrierZ portal. All credentials verified.", 15, 275);

    const nameStr = studentForm.fullName ? studentForm.fullName.replace(/\s+/g, '_') : 'Candidate';
    doc.save(`${nameStr}_Resume.pdf`);
  };



  return (
    <>
      <Navbar />
      <div style={{
        backgroundColor: '#FFFDFB',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        padding: '120px 20px 60px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* Soft Background Gradients */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(60px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(251,146,60,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(50px)'
        }} />

        <div style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          
          <div style={{
            display: 'flex',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
            minHeight: '680px'
          }} className="responsive-register-layout">
            
            {/* Left Sidebar */}
            <div style={{
              width: '280px',
              backgroundColor: '#0F172A',
              padding: '40px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: '#FFFFFF',
              flexShrink: 0
            }} className="register-sidebar">
              
              <div>
                {/* Logo & Title */}
                <div style={{ marginBottom: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <img src="/logo.png" alt="MBK Technology Logo" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
                    <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', margin: 0 }}>MBK</h2>
                  </div>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#FF6B00', letterSpacing: '1px' }}>CarrierZ</span>
                </div>

                {/* Role Tabs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="register-role-tabs-container">
                  {[
                    { id: 'student', title: 'Student', icon: '👤' },
                    { id: 'trainer', title: 'Trainer', icon: '👨‍🏫' },
                    { id: 'company', title: 'Company', icon: '🏢' }
                  ].map((role) => {
                    const isActive = regType === role.id;
                    return (
                      <button
                        key={role.id}
                        onClick={() => handleRoleChange(role.id)}
                        style={{
                          width: '100%',
                          padding: '14px 18px',
                          borderRadius: '12px',
                          border: 'none',
                          backgroundColor: isActive ? '#F97316' : 'transparent',
                          color: '#FFFFFF',
                          textAlign: 'left',
                          fontSize: '14px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'all 0.2s ease',
                          boxShadow: isActive ? '0 4px 12px rgba(249, 115, 22, 0.2)' : 'none'
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>{role.icon}</span>
                        {role.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Need Help Box */}
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '20px 16px',
                textAlign: 'center'
              }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px 0' }}>Need Help?</h4>
                <p style={{ fontSize: '11px', color: '#94A3B8', margin: '0 0 14px 0', lineHeight: 1.4 }}>We are here to help you</p>
                <a
                  href="/contact"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 0',
                    borderRadius: '8px',
                    border: '1px solid #FFFFFF',
                    backgroundColor: 'transparent',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.color = '#0F172A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                >
                  Contact Support
                </a>
              </div>

              {/* Sidebar Footer */}
              <div style={{ fontSize: '10px', color: '#64748B', marginTop: '20px' }}>
                © 2026 MBK CarrierZ<br />All rights reserved.
              </div>
            </div>

            {/* Right Main workspace */}
            <div style={{
              flex: 1,
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF'
            }} className="register-main-panel">
              
              <div>
                {/* Top Title Section */}
                <div style={{ marginBottom: '30px' }}>
                  <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                    {regType === 'student' ? 'Student Registration' : regType === 'trainer' ? 'Trainer Registration' : 'Company Registration'}
                  </h1>
                  <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0 }}>
                    {regType === 'student'
                      ? 'Create your profile to learn, build skills and get placed'
                      : regType === 'trainer'
                      ? 'Join MBK CarrierZ as a professional trainer'
                      : 'Find skilled students and trainers'}
                  </p>
                </div>

                {/* Horizontal Stepper */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '40px',
                  overflowX: 'auto',
                  paddingBottom: '10px'
                }} className="stepper-scroll">
                  {steps.map((step, idx) => {
                    const isActive = currentStep === idx;
                    const isCompleted = currentStep > idx;
                    return (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: isActive ? '#0F172A' : isCompleted ? '#F97316' : '#F1F5F9',
                          color: isActive || isCompleted ? '#FFFFFF' : '#94A3B8',
                          fontSize: '12px',
                          fontWeight: 700
                        }}>
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? '#0F172A' : '#64748B',
                          whiteSpace: 'nowrap'
                        }}>
                          {step.title}
                        </span>
                        {idx < steps.length - 1 && (
                          <div style={{
                            width: '24px',
                            height: '1.5px',
                            backgroundColor: '#E2E8F0',
                            marginLeft: '4px'
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Form Steps Rendering */}
                <div style={{ minHeight: '340px' }}>
                  {errors.general && (
                    <div style={{
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FCA5A5',
                      color: '#B91C1C',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      marginBottom: '20px',
                      fontWeight: 600
                    }}>
                      {errors.general}
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {showTrainerOTP ? (
                      <motion.div
                        key="trainer-otp-verification"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Verify Your Email</h3>
                          <p style={{ fontSize: '13.5px', color: '#64748B', marginBottom: '24px' }}>
                            We sent a 6-digit OTP verification code to <strong>{trainerForm.email}</strong>.
                          </p>

                          {otpError && (
                            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '10px 14px', borderRadius: '8px', fontSize: '12.5px', marginBottom: '16px', fontWeight: 600 }}>
                              {otpError}
                            </div>
                          )}

                          {otpSuccess && (
                            <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', color: '#16A34A', padding: '10px 14px', borderRadius: '8px', fontSize: '12.5px', marginBottom: '16px', fontWeight: 600 }}>
                              {otpSuccess}
                            </div>
                          )}

                          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
                            {trainerOTPCode.map((digit, index) => (
                              <input
                                key={index}
                                ref={(el) => (otpInputRefs.current[index] = el)}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (!/^\d*$/.test(val)) return;
                                  const next = [...trainerOTPCode];
                                  next[index] = val.slice(-1);
                                  setTrainerOTPCode(next);
                                  if (val && index < 5) {
                                    otpInputRefs.current[index + 1]?.focus();
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Backspace' && !trainerOTPCode[index] && index > 0) {
                                    otpInputRefs.current[index - 1]?.focus();
                                  }
                                }}
                                style={{
                                  width: '45px',
                                  height: '50px',
                                  fontSize: '20px',
                                  textAlign: 'center',
                                  borderRadius: '8px',
                                  border: '1px solid #CBD5E1',
                                  outline: 'none',
                                  fontWeight: 'bold',
                                  backgroundColor: '#F8FAFC'
                                }}
                              />
                            ))}
                          </div>

                          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setShowTrainerOTP(false);
                                setOtpError('');
                                setOtpSuccess('');
                              }}
                              style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: '1px solid #CBD5E1',
                                backgroundColor: '#FFFFFF',
                                color: '#0F172A',
                                fontSize: '13px',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={verifyTrainerOTP}
                              disabled={isVerifyingOTP}
                              style={{
                                padding: '10px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#F97316',
                                color: '#FFFFFF',
                                fontSize: '13px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                opacity: isVerifyingOTP ? 0.7 : 1
                              }}
                            >
                              {isVerifyingOTP ? 'Verifying...' : 'Verify & Proceed'}
                            </button>
                          </div>

                          <div style={{ marginTop: '20px', fontSize: '12.5px', color: '#64748B' }}>
                            Didn't receive the code?{' '}
                            <button
                              type="button"
                              onClick={() => sendTrainerOTP(trainerForm.email)}
                              disabled={isSendingOTP}
                              style={{
                                border: 'none',
                                background: 'none',
                                color: '#F97316',
                                fontWeight: 700,
                                cursor: 'pointer',
                                padding: 0
                              }}
                            >
                              {isSendingOTP ? 'Resending...' : 'Resend Code'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`${regType}-${currentStep}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                      {/* --- STUDENT FLOW --- */}
                      {regType === 'student' && (
                        <>
                          {currentStep === 0 && (
                            <div>
                              <PhotoUploadComponent 
                                formType="student" 
                                fileVal={studentForm.photo} 
                                setFileFn={(file) => handleStudentChange('photo', file)} 
                                labelText="Upload Profile Photo" 
                                fieldName="photo" 
                                fallbackInitial={studentForm.fullName}
                                error={errors.photo}
                              />
                              
                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Full Name *</label>
                                <input
                                  type="text"
                                  placeholder="Enter full name"
                                  value={studentForm.fullName}
                                  onChange={(e) => handleStudentChange('fullName', e.target.value)}
                                  style={{ width: '100%', padding: '12px 14px', border: errors.fullName ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                />
                                {errors.fullName && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.fullName}</span>}
                              </div>

                              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Date of Birth *</label>
                                  <input
                                    type="date"
                                    value={studentForm.dob}
                                    onChange={(e) => handleStudentChange('dob', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: errors.dob ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  />
                                  {errors.dob && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.dob}</span>}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Gender *</label>
                                  <select
                                    value={studentForm.gender}
                                    onChange={(e) => handleStudentChange('gender', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: errors.gender ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                  </select>
                                  {errors.gender && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.gender}</span>}
                                </div>
                              </div>

                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Location *</label>
                                <input
                                  type="text"
                                  placeholder="Enter your location"
                                  value={studentForm.location}
                                  onChange={(e) => handleStudentChange('location', e.target.value)}
                                  style={{ width: '100%', padding: '12px 14px', border: errors.location ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                />
                                {errors.location && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.location}</span>}
                              </div>
                            </div>
                          )}

                          {currentStep === 1 && (
                            <div>
                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>College Name *</label>
                                <input
                                  type="text"
                                  placeholder="Enter college name"
                                  value={studentForm.college}
                                  onChange={(e) => handleStudentChange('college', e.target.value)}
                                  style={{ width: '100%', padding: '12px 14px', border: errors.college ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                />
                                {errors.college && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.college}</span>}
                              </div>

                              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Degree *</label>
                                  <input
                                    type="text"
                                    placeholder="Enter degree (e.g. B.E, B.Tech)"
                                    value={studentForm.degree}
                                    onChange={(e) => handleStudentChange('degree', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: errors.degree ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  />
                                  {errors.degree && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.degree}</span>}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Department *</label>
                                  <input
                                    type="text"
                                    placeholder="Enter department"
                                    value={studentForm.department}
                                    onChange={(e) => handleStudentChange('department', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: errors.department ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  />
                                  {errors.department && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.department}</span>}
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Graduation Year *</label>
                                  <input
                                    type="number"
                                    placeholder="YYYY"
                                    value={studentForm.gradYear}
                                    onChange={(e) => handleStudentChange('gradYear', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: errors.gradYear ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  />
                                  {errors.gradYear && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.gradYear}</span>}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>CGPA *</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. 8.5"
                                    value={studentForm.cgpa}
                                    onChange={(e) => handleStudentChange('cgpa', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: errors.cgpa ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  />
                                  {errors.cgpa && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.cgpa}</span>}
                                </div>
                              </div>
                            </div>
                          )}

                          {currentStep === 2 && (
                            <div>
                              <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '10px' }}>Skills *</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                                  {availableSkills.map((skill) => {
                                    const selected = studentForm.skills.includes(skill);
                                    return (
                                      <button
                                        key={skill}
                                        type="button"
                                        onClick={() => toggleSkill(skill)}
                                        style={{
                                          padding: '6px 14px',
                                          borderRadius: '20px',
                                          border: selected ? '1px solid #F97316' : '1px solid #E5E7EB',
                                          backgroundColor: selected ? '#F97316' : '#FFFFFF',
                                          color: selected ? '#FFFFFF' : '#64748B',
                                          cursor: 'pointer',
                                          fontSize: '12.5px',
                                          fontWeight: 600,
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                          transition: 'all 0.15s ease'
                                        }}
                                      >
                                        {skill}
                                        {selected && <span>×</span>}
                                      </button>
                                    );
                                  })}
                                </div>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', maxWidth: '400px' }}>
                                  <input
                                    type="text"
                                    id="custom-skill-input"
                                    placeholder="Add a custom skill (e.g. Node.js)"
                                    style={{ flex: 1, padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const val = e.target.value.trim();
                                        if (val && !studentForm.skills.includes(val)) {
                                          handleStudentChange('skills', [...studentForm.skills, val]);
                                          e.target.value = '';
                                        }
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const input = document.getElementById('custom-skill-input');
                                      if (input) {
                                        const val = input.value.trim();
                                        if (val && !studentForm.skills.includes(val)) {
                                          handleStudentChange('skills', [...studentForm.skills, val]);
                                          input.value = '';
                                        }
                                      }
                                    }}
                                    style={{ padding: '8px 16px', backgroundColor: '#F97316', color: '#FFFFFF', border: 0, borderRadius: '8px', cursor: 'pointer', fontWeight: 650, fontSize: '12px' }}
                                  >
                                    Add
                                  </button>
                                </div>
                                {errors.skills && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '6px', display: 'block' }}>{errors.skills}</span>}
                              </div>

                              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '15px', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>Project Details</h4>
                              
                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Project Title *</label>
                                <input
                                  type="text"
                                  placeholder="Enter project title"
                                  value={studentForm.projectTitle}
                                  onChange={(e) => handleStudentChange('projectTitle', e.target.value)}
                                  style={{ width: '100%', padding: '12px 14px', border: errors.projectTitle ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                />
                                {errors.projectTitle && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.projectTitle}</span>}
                              </div>

                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Project Description *</label>
                                <textarea
                                  placeholder="Describe your project..."
                                  value={studentForm.projectDesc}
                                  onChange={(e) => handleStudentChange('projectDesc', e.target.value)}
                                  style={{ width: '100%', minHeight: '80px', padding: '12px 14px', border: errors.projectDesc ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', resize: 'vertical', fontSize: '13px' }}
                                />
                                {errors.projectDesc && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.projectDesc}</span>}
                              </div>

                              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>GitHub Link</label>
                                  <input
                                    type="url"
                                    placeholder="https://github.com/username/project"
                                    value={studentForm.githubLink}
                                    onChange={(e) => handleStudentChange('githubLink', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>LinkedIn Link</label>
                                  <input
                                    type="url"
                                    placeholder="https://linkedin.com/in/username"
                                    value={studentForm.linkedinLink}
                                    onChange={(e) => handleStudentChange('linkedinLink', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {currentStep === 3 && (
                            <div>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '14px',
                                backgroundColor: '#F0FDF4',
                                border: '1px solid #BBF7D0',
                                borderRadius: '12px',
                                fontSize: '13px',
                                color: '#16A34A',
                                fontWeight: 700,
                                marginBottom: '20px'
                              }}>
                                <span>⚡</span> Your professional resume has been auto-generated successfully!
                              </div>
                             </div>
                          )}

                          {currentStep === 4 && (
                            <div>
                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Email Address *</label>
                                <input
                                  type="email"
                                  placeholder="Enter email address"
                                  value={studentForm.email}
                                  onChange={(e) => handleStudentChange('email', e.target.value)}
                                  style={{ width: '100%', padding: '12px 14px', border: errors.email ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                />
                                {errors.email && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
                              </div>

                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Phone Number *</label>
                                <input
                                  type="tel"
                                  placeholder="Enter phone number"
                                  value={studentForm.phone}
                                  onChange={(e) => handleStudentChange('phone', e.target.value)}
                                  style={{ width: '100%', padding: '12px 14px', border: errors.phone ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                />
                                {errors.phone && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.phone}</span>}
                              </div>

                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Address *</label>
                                <input
                                  type="text"
                                  placeholder="Enter your address"
                                  value={studentForm.address}
                                  onChange={(e) => handleStudentChange('address', e.target.value)}
                                  style={{ width: '100%', padding: '12px 14px', border: errors.address ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                />
                                {errors.address && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.address}</span>}
                              </div>

                              <div style={{
                                marginTop: '15px',
                                padding: '12px 14px',
                                backgroundColor: '#f0f9ff',
                                border: '1px solid #bae6fd',
                                borderRadius: '8px',
                                fontSize: '12.5px',
                                color: '#0284c7',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 600
                              }}>
                                <span>🔒</span> Personal details are visible only to the Admin. 🛡️ Private Information Protected
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* --- TRAINER FLOW --- */}
                      {regType === 'trainer' && (
                        <>
                          {currentStep === 0 && (
                            <div>
                              <PhotoUploadComponent 
                                formType="trainer" 
                                fileVal={trainerForm.photo} 
                                setFileFn={(file) => handleTrainerChange('photo', file)} 
                                labelText="Upload Profile Photo" 
                                fieldName="photo" 
                                fallbackInitial={trainerForm.fullName}
                                error={errors.photo}
                              />

                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Full Name *</label>
                                <input
                                  type="text"
                                  placeholder="Enter full name"
                                  value={trainerForm.fullName}
                                  onChange={(e) => handleTrainerChange('fullName', e.target.value)}
                                  style={{ width: '100%', padding: '12px 14px', border: errors.fullName ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                />
                                {errors.fullName && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.fullName}</span>}
                              </div>

                              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Gender *</label>
                                  <select
                                    value={trainerForm.gender}
                                    onChange={(e) => handleTrainerChange('gender', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: errors.gender ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                  </select>
                                  {errors.gender && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.gender}</span>}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Location *</label>
                                  <input
                                    type="text"
                                    placeholder="Enter your location"
                                    value={trainerForm.location}
                                    onChange={(e) => handleTrainerChange('location', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: errors.location ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  />
                                  {errors.location && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.location}</span>}
                                </div>
                              </div>

                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Email Address *</label>
                                <input
                                  type="email"
                                  placeholder="Enter email address"
                                  value={trainerForm.email}
                                  onChange={(e) => handleTrainerChange('email', e.target.value)}
                                  style={{ width: '100%', padding: '12px 14px', border: (errors.email || (!showTrainerOTP && otpError)) ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                />
                                {errors.email && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
                                {(!showTrainerOTP && otpError) && <span style={{ color: '#ef4444', fontSize: '12.5px', marginTop: '4px', display: 'block' }}>{otpError}</span>}
                              </div>
                            </div>
                          )}

                          {currentStep === 1 && (
                            <div>
                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Core Expertise *</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Fullstack Developer, Data Scientist"
                                  value={trainerForm.expertise}
                                  onChange={(e) => handleTrainerChange('expertise', e.target.value)}
                                  style={{ width: '100%', padding: '12px 14px', border: errors.expertise ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                />
                                {errors.expertise && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.expertise}</span>}
                              </div>

                              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Years of Experience *</label>
                                  <input
                                    type="number"
                                    placeholder="e.g. 5"
                                    value={trainerForm.experienceYears}
                                    onChange={(e) => handleTrainerChange('experienceYears', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: errors.experienceYears ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  />
                                  {errors.experienceYears && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.experienceYears}</span>}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Current Company</label>
                                  <input
                                    type="text"
                                    placeholder="Enter current company name"
                                    value={trainerForm.currentCompany}
                                    onChange={(e) => handleTrainerChange('currentCompany', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  />
                                </div>
                              </div>

                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Professional Summary *</label>
                                <textarea
                                  placeholder="Write a brief professional summary..."
                                  value={trainerForm.summary}
                                  onChange={(e) => handleTrainerChange('summary', e.target.value)}
                                  style={{ width: '100%', minHeight: '80px', padding: '12px 14px', border: errors.summary ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', resize: 'vertical', fontSize: '13px' }}
                                />
                                {errors.summary && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.summary}</span>}
                              </div>
                            </div>
                          )}

                          {currentStep === 2 && (
                            <div>
                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Target Course Name *</label>
                                <input
                                  type="text"
                                  placeholder="Enter course name"
                                  value={trainerForm.courseName}
                                  onChange={(e) => handleTrainerChange('courseName', e.target.value)}
                                  style={{ width: '100%', padding: '12px 14px', border: errors.courseName ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                />
                                {errors.courseName && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.courseName}</span>}
                              </div>

                              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Category *</label>
                                  <select
                                    value={trainerForm.category}
                                    onChange={(e) => handleTrainerChange('category', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: errors.category ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  >
                                    <option value="">Select Category</option>
                                    <option value="IT & Software">IT & Software</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Business Management">Business Management</option>
                                  </select>
                                  {errors.category && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.category}</span>}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Duration *</label>
                                  <input
                                    type="text"
                                    placeholder="Enter duration (e.g., 3 months)"
                                    value={trainerForm.duration}
                                    onChange={(e) => handleTrainerChange('duration', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: errors.duration ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  />
                                  {errors.duration && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.duration}</span>}
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Course Level *</label>
                                  <select
                                    value={trainerForm.level}
                                    onChange={(e) => handleTrainerChange('level', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: errors.level ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  >
                                    <option value="">Select Level</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                  </select>
                                  {errors.level && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.level}</span>}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Teaching Mode *</label>
                                  <select
                                    value={trainerForm.teachingMode}
                                    onChange={(e) => handleTrainerChange('teachingMode', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: errors.teachingMode ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  >
                                    <option value="">Select Mode</option>
                                    <option value="Online">Online</option>
                                    <option value="Offline Classroom">Offline Classroom</option>
                                    <option value="Hybrid Mode">Hybrid Mode</option>
                                  </select>
                                  {errors.teachingMode && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.teachingMode}</span>}
                                </div>
                              </div>

                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Course Description *</label>
                                <textarea
                                  placeholder="Describe your course..."
                                  value={trainerForm.courseDesc}
                                  onChange={(e) => handleTrainerChange('courseDesc', e.target.value)}
                                  style={{ width: '100%', minHeight: '80px', padding: '12px 14px', border: errors.courseDesc ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', resize: 'vertical', fontSize: '13px' }}
                                />
                                {errors.courseDesc && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.courseDesc}</span>}
                              </div>
                            </div>
                          )}

                          {currentStep === 3 && (
                            <div>
                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Professional Resume (PDF) *</label>
                                <input
                                  type="file"
                                  accept=".pdf"
                                  onChange={(e) => handleTrainerChange('resume', e.target.files[0])}
                                  style={{ width: '100%', fontSize: '13px', color: '#64748B' }}
                                />
                                {errors.resume && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.resume}</span>}
                              </div>

                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Experience Certificate (PDF) *</label>
                                <input
                                  type="file"
                                  accept=".pdf"
                                  onChange={(e) => handleTrainerChange('expCertificate', e.target.files[0])}
                                  style={{ width: '100%', fontSize: '13px', color: '#64748B' }}
                                />
                                {errors.expCertificate && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.expCertificate}</span>}
                              </div>

                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Aadhar Card (PDF) *</label>
                                <input
                                  type="file"
                                  accept=".pdf"
                                  onChange={(e) => handleTrainerChange('aadharCard', e.target.files[0])}
                                  style={{ width: '100%', fontSize: '13px', color: '#64748B' }}
                                />
                                {errors.aadharCard && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.aadharCard}</span>}
                              </div>

                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>PAN Card (PDF) *</label>
                                <input
                                  type="file"
                                  accept=".pdf"
                                  onChange={(e) => handleTrainerChange('panCard', e.target.files[0])}
                                  style={{ width: '100%', fontSize: '13px', color: '#64748B' }}
                                />
                                {errors.panCard && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.panCard}</span>}
                              </div>

                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Bank Details (PDF) *</label>
                                <input
                                  type="file"
                                  accept=".pdf"
                                  onChange={(e) => handleTrainerChange('bankDetails', e.target.files[0])}
                                  style={{ width: '100%', fontSize: '13px', color: '#64748B' }}
                                />
                                {errors.bankDetails && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.bankDetails}</span>}
                              </div>

                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>Trainer Signature Agreement *</label>
                                <div style={{ border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px', backgroundColor: '#F9FAFB' }}>
                                  <p style={{ fontSize: '12px', color: '#4B5563', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                                    By signing below, I certify that all documents and information provided are authentic, accurate, and complete.
                                  </p>
                                  <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', overflow: 'hidden', position: 'relative', height: '150px' }}>
                                    <canvas
                                      ref={signatureCanvasRef}
                                      width={500}
                                      height={150}
                                      onMouseDown={startDrawing}
                                      onMouseMove={draw}
                                      onMouseUp={stopDrawing}
                                      onMouseLeave={stopDrawing}
                                      onTouchStart={startDrawing}
                                      onTouchMove={draw}
                                      onTouchEnd={stopDrawing}
                                      style={{ width: '100%', height: '100%', cursor: 'crosshair', display: 'block' }}
                                    />
                                    {trainerForm.signatureAgreement && (
                                      <button
                                        type="button"
                                        onClick={clearSignature}
                                        style={{
                                          position: 'absolute',
                                          top: '8px',
                                          right: '8px',
                                          padding: '4px 10px',
                                          fontSize: '11px',
                                          fontWeight: 700,
                                          backgroundColor: '#EF4444',
                                          color: '#FFFFFF',
                                          border: 'none',
                                          borderRadius: '6px',
                                          cursor: 'pointer',
                                          zIndex: 10
                                        }}
                                      >
                                        Clear
                                      </button>
                                    )}
                                  </div>
                                </div>
                                {errors.signatureAgreement && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.signatureAgreement}</span>}
                              </div>

                              <div style={{
                                marginTop: '15px',
                                padding: '12px 14px',
                                backgroundColor: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                borderRadius: '8px',
                                fontSize: '12.5px',
                                color: '#16a34a',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 600
                              }}>
                                <span>🛡️</span> Documents are visible only to Admin
                              </div>
                            </div>
                          )}

                          {currentStep === 4 && (
                            <div>
                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Email Address *</label>
                                <input
                                  type="email"
                                  placeholder="Enter email address"
                                  value={trainerForm.email}
                                  onChange={(e) => handleTrainerChange('email', e.target.value)}
                                  style={{ width: '100%', padding: '12px 14px', border: errors.email ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                />
                                {errors.email && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
                              </div>

                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Phone Number *</label>
                                <input
                                  type="tel"
                                  placeholder="Enter phone number"
                                  value={trainerForm.phone}
                                  onChange={(e) => handleTrainerChange('phone', e.target.value)}
                                  style={{ width: '100%', padding: '12px 14px', border: errors.phone ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                />
                                {errors.phone && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.phone}</span>}
                              </div>

                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Address *</label>
                                <input
                                  type="text"
                                  placeholder="Enter address"
                                  value={trainerForm.address}
                                  onChange={(e) => handleTrainerChange('address', e.target.value)}
                                  style={{ width: '100%', padding: '12px 14px', border: errors.address ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                />
                                {errors.address && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.address}</span>}
                              </div>

                              <div style={{
                                marginTop: '15px',
                                padding: '12px 14px',
                                backgroundColor: '#f0f9ff',
                                border: '1px solid #bae6fd',
                                borderRadius: '8px',
                                fontSize: '12.5px',
                                color: '#0284c7',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 600
                              }}>
                                <span>🔒</span> Personal details are visible only to the Admin. 🛡️ Private Information Protected
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* --- COMPANY FLOW --- */}
                      {regType === 'company' && (
                        <>
                          {currentStep === 0 && (
                            <div>
                              <PhotoUploadComponent 
                                formType="company" 
                                fileVal={companyForm.logo} 
                                setFileFn={(file) => handleCompanyChange('logo', file)} 
                                labelText="Upload Company Logo" 
                                fieldName="logo" 
                                fallbackInitial={companyForm.companyName}
                                error={errors.logo}
                              />

                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Company Name *</label>
                                <input
                                  type="text"
                                  placeholder="Enter company name"
                                  value={companyForm.companyName}
                                  onChange={(e) => handleCompanyChange('companyName', e.target.value)}
                                  style={{ width: '100%', padding: '12px 14px', border: errors.companyName ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                />
                                {errors.companyName && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.companyName}</span>}
                              </div>

                              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Industry *</label>
                                  <select
                                    value={companyForm.industry}
                                    onChange={(e) => handleCompanyChange('industry', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: errors.industry ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  >
                                    <option value="">Select Industry</option>
                                    <option value="Information Technology">Information Technology</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Education">Education</option>
                                  </select>
                                  {errors.industry && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.industry}</span>}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Website URL *</label>
                                  <input
                                    type="text"
                                    placeholder="https://yourcompany.com"
                                    value={companyForm.website}
                                    onChange={(e) => handleCompanyChange('website', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: errors.website ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  />
                                  {errors.website && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.website}</span>}
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Location *</label>
                                  <input
                                    type="text"
                                    placeholder="Enter company location"
                                    value={companyForm.location}
                                    onChange={(e) => handleCompanyChange('location', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: errors.location ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  />
                                  {errors.location && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.location}</span>}
                                </div>
                              </div>

                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Company Description *</label>
                                <textarea
                                  placeholder="Tell us about your company..."
                                  value={companyForm.companyDesc}
                                  onChange={(e) => handleCompanyChange('companyDesc', e.target.value)}
                                  style={{ width: '100%', minHeight: '80px', padding: '12px 14px', border: errors.companyDesc ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', resize: 'vertical', fontSize: '13px' }}
                                />
                                {errors.companyDesc && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.companyDesc}</span>}
                              </div>
                            </div>
                          )}

                          {currentStep === 1 && (
                            <div>
                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Job Roles Hiring for *</label>
                                <input
                                  type="text"
                                  placeholder="Enter job roles"
                                  value={companyForm.jobRoles}
                                  onChange={(e) => handleCompanyChange('jobRoles', e.target.value)}
                                  style={{ width: '100%', padding: '12px 14px', border: errors.jobRoles ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                />
                                {errors.jobRoles && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.jobRoles}</span>}
                              </div>

                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Required Skills *</label>
                                <input
                                  type="text"
                                  placeholder="Enter required skills"
                                  value={companyForm.requiredSkills}
                                  onChange={(e) => handleCompanyChange('requiredSkills', e.target.value)}
                                  style={{ width: '100%', padding: '12px 14px', border: errors.requiredSkills ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                />
                                {errors.requiredSkills && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.requiredSkills}</span>}
                              </div>

                              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Experience Required *</label>
                                  <select
                                    value={companyForm.expRequired}
                                    onChange={(e) => handleCompanyChange('expRequired', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: errors.expRequired ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  >
                                    <option value="">Select experience level</option>
                                    <option value="Freshers">Freshers</option>
                                    <option value="1-3 Years">1-3 Years</option>
                                    <option value="3-5 Years">3-5 Years</option>
                                    <option value="5+ Years">5+ Years</option>
                                  </select>
                                  {errors.expRequired && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.expRequired}</span>}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Company Size *</label>
                                  <select
                                    value={companyForm.companySize}
                                    onChange={(e) => handleCompanyChange('companySize', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: errors.companySize ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  >
                                    <option value="">Select company size</option>
                                    <option value="1-10 employees">1-10 employees</option>
                                    <option value="11-50 employees">11-50 employees</option>
                                    <option value="51-200 employees">51-200 employees</option>
                                    <option value="201-500 employees">201-500 employees</option>
                                    <option value="500+ employees">500+ employees</option>
                                  </select>
                                  {errors.companySize && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.companySize}</span>}
                                </div>
                              </div>

                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Work Mode *</label>
                                <select
                                  value={companyForm.workMode}
                                  onChange={(e) => handleCompanyChange('workMode', e.target.value)}
                                  style={{ width: '100%', padding: '12px 14px', border: errors.workMode ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                >
                                  <option value="">Select work mode</option>
                                  <option value="Onsite">Onsite</option>
                                  <option value="Remote">Remote</option>
                                  <option value="Hybrid">Hybrid</option>
                                </select>
                                {errors.workMode && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.workMode}</span>}
                              </div>
                            </div>
                          )}

                          {currentStep === 2 && (
                            <div>
                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>HR Name *</label>
                                <input
                                  type="text"
                                  placeholder="Enter HR name"
                                  value={companyForm.hrName}
                                  onChange={(e) => handleCompanyChange('hrName', e.target.value)}
                                  style={{ width: '100%', padding: '12px 14px', border: errors.hrName ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                />
                                {errors.hrName && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.hrName}</span>}
                              </div>

                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>HR Designation *</label>
                                <input
                                  type="text"
                                  placeholder="Enter designation"
                                  value={companyForm.hrDesignation}
                                  onChange={(e) => handleCompanyChange('hrDesignation', e.target.value)}
                                  style={{ width: '100%', padding: '12px 14px', border: errors.hrDesignation ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                />
                                {errors.hrDesignation && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.hrDesignation}</span>}
                              </div>

                              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>HR Phone *</label>
                                  <input
                                    type="tel"
                                    placeholder="Enter phone number"
                                    value={companyForm.hrPhone}
                                    onChange={(e) => handleCompanyChange('hrPhone', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: errors.hrPhone ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  />
                                  {errors.hrPhone && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.hrPhone}</span>}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>HR Email *</label>
                                  <input
                                    type="email"
                                    placeholder="Enter email"
                                    value={companyForm.hrEmail}
                                    onChange={(e) => handleCompanyChange('hrEmail', e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', border: errors.hrEmail ? '1px solid #ef4444' : '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                                  />
                                  {errors.hrEmail && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.hrEmail}</span>}
                                </div>
                              </div>

                              <div style={{
                                marginTop: '15px',
                                padding: '12px 14px',
                                backgroundColor: '#f0f9ff',
                                border: '1px solid #bae6fd',
                                borderRadius: '8px',
                                fontSize: '12.5px',
                                color: '#0284c7',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 600
                              }}>
                                <span>🔒</span> Personal details are visible only to the Admin. 🛡️ Private Information Protected
                              </div>
                            </div>
                          )}

                          {currentStep === 3 && (
                            <div>
                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Registration Certificate (PDF) *</label>
                                <input
                                  type="file"
                                  accept=".pdf"
                                  onChange={(e) => handleCompanyChange('regCertificate', e.target.files[0])}
                                  style={{ width: '100%', fontSize: '13px', color: '#64748B' }}
                                />
                                {errors.regCertificate && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.regCertificate}</span>}
                              </div>

                              <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>GST Certificate (PDF) *</label>
                                <input
                                  type="file"
                                  accept=".pdf"
                                  onChange={(e) => handleCompanyChange('gstCertificate', e.target.files[0])}
                                  style={{ width: '100%', fontSize: '13px', color: '#64748B' }}
                                />
                                {errors.gstCertificate && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.gstCertificate}</span>}
                              </div>

                              <div style={{
                                marginTop: '15px',
                                padding: '12px 14px',
                                backgroundColor: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                borderRadius: '8px',
                                fontSize: '12.5px',
                                color: '#16a34a',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 600
                              }}>
                                <span>🛡️</span> Documents visible only to Admin
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

               {/* General Error Display */}
               {errors.general && (
                 <div style={{
                   backgroundColor: '#FEF2F2',
                   border: '1px solid #FCA5A5',
                   color: '#B91C1C',
                   padding: '12px 16px',
                   borderRadius: '10px',
                   fontSize: '13px',
                   fontWeight: 600,
                   marginTop: '16px',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '8px'
                 }}>
                   <span>⚠️</span> {errors.general}
                 </div>
               )}

               {/* Navigation Footer */}
               {!showTrainerOTP && (
                 <div>
                   <div style={{
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     marginTop: '40px',
                     borderTop: '1px solid #F1F5F9',
                     paddingTop: '20px'
                   }}>
                     {/* Safety note at the bottom */}
                     <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '12px', fontWeight: 500 }}>
                       <span>🛡️</span>
                       {regType === 'student' && 'All your personal information is safe and secure'}
                       {regType === 'trainer' && 'Your information is secure and will not be shared'}
                       {regType === 'company' && 'All company information is secure and private'}
                     </div>
 
                     {/* Buttons */}
                     <div style={{ display: 'flex', gap: '12px' }}>
                       {currentStep > 0 && (
                         <button
                           type="button"
                           onClick={handleBack}
                           style={{
                             padding: '10px 22px',
                             backgroundColor: 'transparent',
                             border: '1px solid #E2E8F0',
                             borderRadius: '8px',
                             color: '#4B5563',
                             fontSize: '13.5px',
                             fontWeight: 600,
                             cursor: 'pointer',
                             transition: 'all 0.15s ease'
                           }}
                         >
                           Back
                         </button>
                       )}
 
                       <button
                         type="button"
                         onClick={handleNext}
                         disabled={isSubmitting}
                         style={{
                           padding: '12px 28px',
                           background: 'linear-gradient(135deg, #F97316, #FB923C)',
                           border: 'none',
                           borderRadius: '8px',
                           color: '#ffffff',
                           fontSize: '14px',
                           fontWeight: 700,
                           cursor: 'pointer',
                           boxShadow: '0 4px 12px rgba(249, 115, 22, 0.2)',
                           transition: 'all 0.15s ease'
                         }}
                       >
                         {isSubmitting ? 'Verifying...' : currentStep === steps.length - 1 ? (regType === 'student' ? 'Create Student Profile' : regType === 'trainer' ? 'Register as Trainer' : 'Register Company') : 'Next'}
                       </button>
                     </div>
                   </div>
                 </div>
               )}

            </div>

          </div>

        </div>
      </div>

      {/* Success Dialog Modal Overlay */}
      {isSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '40px',
              maxWidth: '480px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.15)',
              border: '1px solid #E5E7EB',
              color: '#0F172A'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#10B981',
              fontSize: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              fontWeight: 'bold'
            }}>
              ✓
            </div>
            
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 10px 0' }}>✅ Registration Successful</h2>
            <p style={{ fontSize: '15px', color: '#64748B', margin: '0 0 24px 0', lineHeight: '1.6' }}>
              Your profile has been submitted for Admin verification.<br />
              {regType === 'student' && 'Your professional MBK CarrierZ resume has been generated automatically.'}
            </p>

            <div style={{
              backgroundColor: '#FEF3C7',
              border: '1px solid #FDE68A',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '30px',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>⏳</span>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#92400E' }}>Status: Pending Admin Approval</p>
                <span style={{ fontSize: '12px', color: '#B45309', display: 'block', marginTop: '2px' }}>
                  Our Board of Admin recruiters will review your submitted credentials and verification documents. Access details will be sent to your email.
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #F97316, #FB923C)',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.2)'
              }}
            >
              Go to Dashboard
            </button>
          </motion.div>
        </div>
      )}
      {/* Phone OTP Verification Modal */}
      {showPhoneOTP && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.15)',
            border: '1px solid #E5E7EB',
            color: '#0F172A'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Verify Your Email Address</h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', marginBottom: '24px' }}>
              We sent a 6-digit verification code to <strong>{regType === 'student' ? studentForm.email : regType === 'trainer' ? trainerForm.email : companyForm.hrEmail}</strong>.
            </p>

            {phoneOtpError && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '10px 14px', borderRadius: '8px', fontSize: '12.5px', marginBottom: '16px', fontWeight: 600 }}>
                {phoneOtpError}
              </div>
            )}

            {phoneOtpSuccess && (
              <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', color: '#16A34A', padding: '10px 14px', borderRadius: '8px', fontSize: '12.5px', marginBottom: '16px', fontWeight: 600 }}>
                {phoneOtpSuccess}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
              {phoneOTPCode.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputRefs.current[index + 6] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!/^\d*$/.test(val)) return;
                    const next = [...phoneOTPCode];
                    next[index] = val.slice(-1);
                    setPhoneOTPCode(next);
                    if (val && index < 5) {
                      otpInputRefs.current[index + 7]?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !phoneOTPCode[index] && index > 0) {
                      otpInputRefs.current[index + 5]?.focus();
                    }
                  }}
                  style={{
                    width: '45px',
                    height: '50px',
                    fontSize: '20px',
                    textAlign: 'center',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    fontWeight: 'bold',
                    backgroundColor: '#F8FAFC'
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setShowPhoneOTP(false);
                  setPhoneOtpError('');
                  setPhoneOtpSuccess('');
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => verifyPhoneOTP(regType === 'student' ? studentForm.email : regType === 'trainer' ? trainerForm.email : companyForm.hrEmail)}
                disabled={isVerifyingPhoneOTP}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#F97316',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  opacity: isVerifyingPhoneOTP ? 0.7 : 1
                }}
              >
                {isVerifyingPhoneOTP ? 'Verifying...' : 'Verify & Submit'}
              </button>
            </div>

            <div style={{ marginTop: '20px', fontSize: '12.5px', color: '#64748B' }}>
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={() => sendPhoneOTP(regType === 'student' ? studentForm.email : regType === 'trainer' ? trainerForm.email : companyForm.hrEmail)}
                disabled={isSendingPhoneOTP}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#F97316',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {isSendingPhoneOTP ? 'Resending...' : 'Resend Code'}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}