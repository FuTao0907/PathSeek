import '@/styles/Profile.css';
import React, { createContext, useContext, useState } from 'react';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

interface UserProfile {
  name: string;
  avatar: string;
  bio: string;
  socialLinks: SocialLink[];
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    link?: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    year: string;
  }>;
}

interface ProfileContextType {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Path Seeker',
    avatar: '/avatar-placeholder.svg',
    bio: '热爱探索和分享的开发者',
    socialLinks: [
      {
        id: '1',
        platform: 'GitHub',
        url: 'https://github.com',
        icon: '🐙',
      },
      {
        id: '2',
        platform: 'Twitter',
        url: 'https://twitter.com',
        icon: '🐦',
      },
      {
        id: '3',
        platform: '个人网站',
        url: 'https://example.com',
        icon: '🌐',
      },
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Git'],
    projects: [
      {
        name: 'Path Seek',
        description:
          '一个现代化的博客平台，支持Markdown编写，具有良好的SEO优化',
        link: 'https://github.com/path-seek',
      },
    ],
    education: [
      {
        school: '示例大学',
        degree: '学士',
        field: '计算机科学与技术',
        year: '2019-2023',
      },
    ],
  });

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { profile, setProfile } = useProfile();

  const handleSave = () => {
    // 这里可以添加保存到后端的逻辑
    setIsEditing(false);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({
          ...profile,
          avatar: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="content-area profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-header-top">
            <div className="avatar-container">
              <img
                src={profile.avatar}
                alt="用户头像"
                className="profile-avatar"
              />
              {isEditing && (
                <label className="avatar-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  📷
                </label>
              )}
            </div>
            {isEditing ? (
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="profile-name-input"
              />
            ) : (
              <h1 className="profile-name">{profile.name}</h1>
            )}
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>个人简介</h2>
            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                className="profile-bio-input"
              />
            ) : (
              <p className="profile-bio">{profile.bio}</p>
            )}
          </div>

          <div className="profile-section">
            <h2>社交链接</h2>
            {isEditing ? (
              <div className="social-links-edit">
                {profile.socialLinks.map(link => (
                  <div key={link.id} className="social-link-input-group">
                    <div className="social-link-input">
                      <label>平台名称:</label>
                      <input
                        type="text"
                        value={link.platform}
                        onChange={e => {
                          const updatedLinks = profile.socialLinks.map(l =>
                            l.id === link.id
                              ? { ...l, platform: e.target.value }
                              : l
                          );
                          setProfile({ ...profile, socialLinks: updatedLinks });
                        }}
                        placeholder="如：GitHub, Twitter, 个人网站"
                      />
                    </div>
                    <div className="social-link-input">
                      <label>链接地址:</label>
                      <input
                        type="url"
                        value={link.url}
                        onChange={e => {
                          const updatedLinks = profile.socialLinks.map(l =>
                            l.id === link.id ? { ...l, url: e.target.value } : l
                          );
                          setProfile({ ...profile, socialLinks: updatedLinks });
                        }}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="social-link-input">
                      <label>图标:</label>
                      <input
                        type="text"
                        value={link.icon}
                        onChange={e => {
                          const updatedLinks = profile.socialLinks.map(l =>
                            l.id === link.id
                              ? { ...l, icon: e.target.value }
                              : l
                          );
                          setProfile({ ...profile, socialLinks: updatedLinks });
                        }}
                        placeholder="🔗"
                        maxLength={2}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedLinks = profile.socialLinks.filter(
                          l => l.id !== link.id
                        );
                        setProfile({ ...profile, socialLinks: updatedLinks });
                      }}
                      className="remove-social-link"
                    >
                      ❌
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newLink: SocialLink = {
                      id: Date.now().toString(),
                      platform: '新平台',
                      url: '',
                      icon: '🔗',
                    };
                    setProfile({
                      ...profile,
                      socialLinks: [...profile.socialLinks, newLink],
                    });
                  }}
                  className="add-social-link"
                >
                  ➕ 添加社交链接
                </button>
              </div>
            ) : (
              <div className="social-links">
                {profile.socialLinks.map(
                  link =>
                    link.url && (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="social-icon">{link.icon}</span>
                        {link.platform}
                      </a>
                    )
                )}
              </div>
            )}
          </div>

          <div className="profile-section">
            <h2>技能专长</h2>
            {isEditing ? (
              <div className="skills-edit">
                <input
                  type="text"
                  placeholder="添加新技能（按回车添加）"
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement;
                      const newSkill = input.value.trim();
                      if (newSkill && !profile.skills.includes(newSkill)) {
                        setProfile({
                          ...profile,
                          skills: [...profile.skills, newSkill],
                        });
                        input.value = '';
                      }
                    }
                  }}
                  className="skill-input"
                />
                <div className="skills-list">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                      <button
                        onClick={() => {
                          setProfile({
                            ...profile,
                            skills: profile.skills.filter(
                              (_, i) => i !== index
                            ),
                          });
                        }}
                        className="remove-skill"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="skills-list">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="profile-section">
            <h2>项目经历</h2>
            {isEditing ? (
              <div className="projects-edit">
                {profile.projects.map((project, index) => (
                  <div key={index} className="project-edit-item">
                    <input
                      type="text"
                      value={project.name}
                      onChange={e => {
                        const newProjects = [...profile.projects];
                        newProjects[index] = {
                          ...project,
                          name: e.target.value,
                        };
                        setProfile({ ...profile, projects: newProjects });
                      }}
                      placeholder="项目名称"
                    />
                    <textarea
                      value={project.description}
                      onChange={e => {
                        const newProjects = [...profile.projects];
                        newProjects[index] = {
                          ...project,
                          description: e.target.value,
                        };
                        setProfile({ ...profile, projects: newProjects });
                      }}
                      placeholder="项目描述"
                    />
                    <input
                      type="url"
                      value={project.link}
                      onChange={e => {
                        const newProjects = [...profile.projects];
                        newProjects[index] = {
                          ...project,
                          link: e.target.value,
                        };
                        setProfile({ ...profile, projects: newProjects });
                      }}
                      placeholder="项目链接"
                    />
                    <button
                      onClick={() => {
                        setProfile({
                          ...profile,
                          projects: profile.projects.filter(
                            (_, i) => i !== index
                          ),
                        });
                      }}
                      className="remove-project"
                    >
                      删除项目
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setProfile({
                      ...profile,
                      projects: [
                        ...profile.projects,
                        { name: '', description: '', link: '' },
                      ],
                    });
                  }}
                  className="add-project"
                >
                  添加项目
                </button>
              </div>
            ) : (
              <div className="projects-list">
                {profile.projects.map((project, index) => (
                  <div key={index} className="project-item">
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        查看项目
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="profile-section">
            <h2>教育背景</h2>
            {isEditing ? (
              <div className="education-edit">
                {profile.education.map((edu, index) => (
                  <div key={index} className="education-edit-item">
                    <input
                      type="text"
                      value={edu.school}
                      onChange={e => {
                        const newEducation = [...profile.education];
                        newEducation[index] = {
                          ...edu,
                          school: e.target.value,
                        };
                        setProfile({ ...profile, education: newEducation });
                      }}
                      placeholder="学校名称"
                    />
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={e => {
                        const newEducation = [...profile.education];
                        newEducation[index] = {
                          ...edu,
                          degree: e.target.value,
                        };
                        setProfile({ ...profile, education: newEducation });
                      }}
                      placeholder="学位"
                    />
                    <input
                      type="text"
                      value={edu.field}
                      onChange={e => {
                        const newEducation = [...profile.education];
                        newEducation[index] = { ...edu, field: e.target.value };
                        setProfile({ ...profile, education: newEducation });
                      }}
                      placeholder="专业"
                    />
                    <input
                      type="text"
                      value={edu.year}
                      onChange={e => {
                        const newEducation = [...profile.education];
                        newEducation[index] = { ...edu, year: e.target.value };
                        setProfile({ ...profile, education: newEducation });
                      }}
                      placeholder="年份"
                    />
                    <button
                      onClick={() => {
                        setProfile({
                          ...profile,
                          education: profile.education.filter(
                            (_, i) => i !== index
                          ),
                        });
                      }}
                      className="remove-education"
                    >
                      删除
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setProfile({
                      ...profile,
                      education: [
                        ...profile.education,
                        { school: '', degree: '', field: '', year: '' },
                      ],
                    });
                  }}
                  className="add-education"
                >
                  添加教育经历
                </button>
              </div>
            ) : (
              <div className="education-list">
                {profile.education.map((edu, index) => (
                  <div key={index} className="education-item">
                    <h3>{edu.school}</h3>
                    <p>
                      {edu.degree} · {edu.field}
                    </p>
                    <p>{edu.year}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="profile-actions">
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="edit-button"
            >
              {isEditing ? '保存' : '编辑资料'}
            </button>
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="cancel-button"
              >
                取消
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
