export interface WelcomeBannerProps {
  title?: string;
  subtitle?: string;
  locale?: 'en' | 'hi' | 'id';
  customClass?: string;
}

export interface WelcomeBannerLocale {
  welcome_title: string;
  welcome_subtitle: string;
}

export interface WelcomeBannerConfig {
  defaultLocale: 'en' | 'hi' | 'id';
  showAnimation: boolean;
  theme: 'light' | 'dark';
}