import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, GraduationCap, Briefcase, FileText, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ToastProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const StudentProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    education: '',
    major: '',
    graduationYear: '',
    skills: '',
    experience: '',
    portfolio: '',
    resume: null as File | null
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    try {
      // In a real application, this would connect to the backend
      updateUser({ name: profileData.name });
      setIsEditing(false);
      showSuccess('Profile Updated', 'Your profile has been updated successfully!');
    } catch (error) {
      showError('Update Failed', 'Failed to update profile. Please try again.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showError('File Too Large', 'File size must be less than 5MB');
        return;
      }
      setProfileData(prev => ({ ...prev, [field]: file }));
      showSuccess('File Uploaded', `${field === 'resume' ? 'Resume' : 'Document'} uploaded successfully!`);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url('/images/Download Abstract green papercut style layers background for free.jpeg')` }}
      ></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Button 
          onClick={() => navigate(-1)} 
          variant="ghost"
          className="flex items-center mb-6 text-primary hover:bg-accent"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </Button>
        
        <div className="bg-card shadow-lg rounded-xl overflow-hidden border border-border">
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Student Profile</h1>
                <p className="mt-2 text-primary-foreground/90">
                  Manage your personal information and career details
                </p>
              </div>
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                variant="secondary"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Picture Section */}
              <Card className="md:col-span-1 border border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-foreground">
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <User size={48} className="text-primary" />
                    </div>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        Upload Photo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Personal Information */}
              <Card className="md:col-span-2 border border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-foreground">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
                          value={profileData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                      ) : (
                        <p className="text-foreground">{profileData.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Email Address
                      </label>
                      <div className="flex items-center">
                        <Mail size={16} className="text-muted-foreground mr-2" />
                        <p className="text-foreground">{profileData.email}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <div className="flex">
                          <Phone size={16} className="text-muted-foreground mr-2 mt-2" />
                          <input
                            type="tel"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
                            value={profileData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Phone size={16} className="text-muted-foreground mr-2" />
                          <p className="text-foreground">{profileData.phone || 'Not provided'}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Location
                      </label>
                      {isEditing ? (
                        <div className="flex">
                          <MapPin size={16} className="text-muted-foreground mr-2 mt-2" />
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
                            value={profileData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            placeholder="City, State"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <MapPin size={16} className="text-muted-foreground mr-2" />
                          <p className="text-foreground">{profileData.location || 'Not provided'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Education Information */}
              <Card className="md:col-span-3 border border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-foreground">
                    <GraduationCap size={20} className="inline mr-2" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Institution
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
                          value={profileData.education}
                          onChange={(e) => handleInputChange('education', e.target.value)}
                          placeholder="University Name"
                        />
                      ) : (
                        <p className="text-foreground">{profileData.education || 'Not provided'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Major
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
                          value={profileData.major}
                          onChange={(e) => handleInputChange('major', e.target.value)}
                          placeholder="Computer Science"
                        />
                      ) : (
                        <p className="text-foreground">{profileData.major || 'Not provided'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Graduation Year
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
                          value={profileData.graduationYear}
                          onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                          placeholder="2024"
                        />
                      ) : (
                        <p className="text-foreground">{profileData.graduationYear || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Skills and Experience */}
              <Card className="md:col-span-3 border border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-foreground">
                    <Briefcase size={20} className="inline mr-2" />
                    Skills & Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Skills
                    </label>
                    {isEditing ? (
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
                        value={profileData.skills}
                        onChange={(e) => handleInputChange('skills', e.target.value)}
                        placeholder="List your technical and soft skills..."
                      />
                    ) : (
                      <p className="text-foreground">{profileData.skills || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Work Experience
                    </label>
                    {isEditing ? (
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
                        value={profileData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        placeholder="Describe your relevant work experience..."
                      />
                    ) : (
                      <p className="text-foreground">{profileData.experience || 'Not provided'}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Portfolio and Documents */}
              <Card className="md:col-span-3 border border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-foreground">
                    <LinkIcon size={20} className="inline mr-2" />
                    Portfolio & Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Portfolio Link
                    </label>
                    {isEditing ? (
                      <div className="flex">
                        <LinkIcon size={16} className="text-muted-foreground mr-2 mt-2" />
                        <input
                          type="url"
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
                          value={profileData.portfolio}
                          onChange={(e) => handleInputChange('portfolio', e.target.value)}
                          placeholder="https://your-portfolio.com"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <LinkIcon size={16} className="text-muted-foreground mr-2" />
                        {profileData.portfolio ? (
                          <a 
                            href={profileData.portfolio} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {profileData.portfolio}
                          </a>
                        ) : (
                          <p className="text-foreground">Not provided</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Resume
                      </label>
                      {isEditing ? (
                        <div className="border border-dashed border-border rounded-lg p-4 text-center">
                          <FileText size={24} className="mx-auto text-muted-foreground mb-2" />
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileUpload(e, 'resume')}
                            className="hidden"
                            id="resume-upload"
                          />
                          <Button 
                            onClick={() => document.getElementById('resume-upload')?.click()}
                            variant="outline"
                            size="sm"
                          >
                            Upload Resume
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">
                            PDF, DOC, DOCX (Max 5MB)
                          </p>
                        </div>
                      ) : (
                        <p className="text-foreground">{profileData.resume ? profileData.resume.name : 'No resume uploaded'}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {isEditing && (
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} variant="default">
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;