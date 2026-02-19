export interface SocialLink {
  name: string
  icon: string
  url: string
}

export interface Profile {
  name: string
  avatar: string
  bio: string
  location?: string
  links: SocialLink[]
}
