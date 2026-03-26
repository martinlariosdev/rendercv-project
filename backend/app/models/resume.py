from __future__ import annotations

from enum import Enum
from typing import Any, Optional, Union

from pydantic import BaseModel, ConfigDict


# --- Social Network Enum ---

class SocialNetworkName(str, Enum):
    LINKEDIN = "LinkedIn"
    GITHUB = "GitHub"
    GITLAB = "GitLab"
    IMDB = "IMDB"
    INSTAGRAM = "Instagram"
    ORCID = "ORCID"
    MASTODON = "Mastodon"
    STACKOVERFLOW = "StackOverflow"
    RESEARCHGATE = "ResearchGate"
    YOUTUBE = "YouTube"
    GOOGLE_SCHOLAR = "Google Scholar"
    TELEGRAM = "Telegram"
    WHATSAPP = "WhatsApp"
    LEETCODE = "Leetcode"
    X = "X"
    BLUESKY = "Bluesky"
    REDDIT = "Reddit"


class SocialNetwork(BaseModel):
    network: SocialNetworkName
    username: str


# --- Entry Types ---

class EducationEntry(BaseModel):
    institution: str
    area: str
    degree: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    highlights: Optional[list[str]] = None


class ExperienceEntry(BaseModel):
    company: str
    position: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    highlights: Optional[list[str]] = None


class NormalEntry(BaseModel):
    name: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    highlights: Optional[list[str]] = None


class PublicationEntry(BaseModel):
    title: str
    authors: list[str]
    doi: Optional[str] = None
    url: Optional[str] = None
    journal: Optional[str] = None
    date: Optional[str] = None
    summary: Optional[str] = None


class OneLineEntry(BaseModel):
    label: str
    details: str


class BulletEntry(BaseModel):
    bullet: str


# TextEntry is represented as a plain string in the sections list,
# so we don't need a separate model for it.

# Union of all entry types. Plain strings represent TextEntry.
EntryType = Union[
    EducationEntry,
    ExperienceEntry,
    NormalEntry,
    PublicationEntry,
    OneLineEntry,
    BulletEntry,
    str,
]


# --- Design Sub-Models ---

class PageConfig(BaseModel):
    model_config = ConfigDict(extra="allow")

    size: Optional[str] = None
    top_margin: Optional[str] = None
    bottom_margin: Optional[str] = None
    left_margin: Optional[str] = None
    right_margin: Optional[str] = None


class ColorsConfig(BaseModel):
    model_config = ConfigDict(extra="allow")

    body: Optional[str] = None
    name: Optional[str] = None
    headline: Optional[str] = None
    connections: Optional[str] = None
    section_titles: Optional[str] = None
    links: Optional[str] = None
    footer: Optional[str] = None


class FontSizeConfig(BaseModel):
    model_config = ConfigDict(extra="allow")

    small: Optional[str] = None
    normal: Optional[str] = None
    large: Optional[str] = None


class TypographyConfig(BaseModel):
    model_config = ConfigDict(extra="allow")

    font_family: Optional[str] = None
    font_size: Optional[FontSizeConfig] = None
    line_spacing: Optional[str] = None
    alignment: Optional[str] = None


class LinksConfig(BaseModel):
    model_config = ConfigDict(extra="allow")

    underline: Optional[bool] = None
    show_external_link_icon: Optional[bool] = None


class HeaderConfig(BaseModel):
    model_config = ConfigDict(extra="allow")

    alignment: Optional[str] = None


class SectionTitlesConfig(BaseModel):
    model_config = ConfigDict(extra="allow")

    type: Optional[str] = None


class EntriesConfig(BaseModel):
    model_config = ConfigDict(extra="allow")

    date_and_location_width: Optional[str] = None


class DesignConfig(BaseModel):
    model_config = ConfigDict(extra="allow")

    theme: Optional[str] = "classic"
    page: Optional[PageConfig] = None
    colors: Optional[ColorsConfig] = None
    typography: Optional[TypographyConfig] = None
    links: Optional[LinksConfig] = None
    header: Optional[HeaderConfig] = None
    section_titles: Optional[SectionTitlesConfig] = None
    entries: Optional[EntriesConfig] = None


# --- CV Data ---

class CvData(BaseModel):
    name: Optional[str] = None
    headline: Optional[str] = None
    location: Optional[str] = None
    email: Optional[Union[str, list[str]]] = None
    phone: Optional[Union[str, list[str]]] = None
    website: Optional[Union[str, list[str]]] = None
    social_networks: Optional[list[SocialNetwork]] = None
    sections: Optional[dict[str, list[Any]]] = None


# --- Top-Level Resume Data ---

class LocaleConfig(BaseModel):
    model_config = ConfigDict(extra="allow")

    language: str = "english"


class ResumeData(BaseModel):
    cv: CvData
    design: Optional[DesignConfig] = None
    locale: Optional[LocaleConfig] = None
    settings: Optional[dict[str, Any]] = None
