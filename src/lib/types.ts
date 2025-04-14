export type LocaleText = {
  zh: string;
  ja: string;
  en: string;
};

export type Locale = {
  code: string;
  name: string;
  flag: string;
};

export type SiteConfig = {
  site: {
    title: LocaleText;
    description: LocaleText;
    discord: string;
    logo: string;
    email: string;
    social: {
      twitter: string;
      github: string;
      linkedin: string;
    };
  };
  navigation: {
    main: Array<{
      id: string;
      name: LocaleText;
      path: string;
    }>;
  };
  i18n: {
    locales: Locale[];
    defaultLocale: string;
  };
};

export type Event = {
  id: string;
  date: string;
  image: string;
  title: LocaleText;
  description: LocaleText;
  link: string;
};

export type Events = {
  events: Event[];
};

export type CategoryItem = {
  id: string;
  title: LocaleText;
  description: LocaleText;
  link: string;
};

export type Category = {
  id: string;
  name: LocaleText;
  description: LocaleText;
  icon: string;
  color: string;
  items: CategoryItem[];
};

export type Categories = {
  categories: Category[];
}; 