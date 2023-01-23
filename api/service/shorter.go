package service

import (
	gonanoid "github.com/matoous/go-nanoid"
	"leizhenpeng/link-shorter-api/model"
	"net/url"
)

type Core interface {
	genShorter() (string, error)
	ifExist(shorter string) bool
	GetShorter(key string) (string, error)
	GetRaw(key string) (string, error)
	ValidLink(link string) bool
	SetDb(db *model.ShorterDB)
	ShowAll() (map[string]string, error)
	ClearAll() error
	DelOne(key string) error
}

type ShorterService struct {
	DB *model.ShorterDB
}

func NewShorterService(db *model.ShorterDB) *ShorterService {
	return &ShorterService{db}
}

func (s ShorterService) DelOne(key string) error {
	return s.DB.Del(key)
}

func (s ShorterService) ShowAll() (map[string]string, error) {
	all, err := s.DB.All()
	if err != nil {
		return nil, err
	}
	return all, nil
}

func (s ShorterService) ClearAll() error {
	return s.DB.Flush()
}

func (s ShorterService) SetDb(db *model.ShorterDB) {
	s.DB = db
}

func (s ShorterService) ifExist(shorter string) bool {
	get, err := s.DB.Get(shorter)
	if err != nil {
		return false
	}
	if get == "" {
		return false
	}
	return true

}

func (s ShorterService) GetShorter(url string) (string, error) {
	for {
		shorter, err := s.genShorter()
		if err != nil {
			return "", err
		}
		if !s.ifExist(shorter) {
			err = s.DB.Set(shorter, url)
			return shorter, nil
		}
	}

}

func (s ShorterService) genShorter() (string, error) {
	id, err := gonanoid.ID(6)
	if err != nil {
		return "", err
	}
	return id, nil
}

func (s ShorterService) GetRaw(key string) (string, error) {
	return s.DB.Get(key)
}

func (s ShorterService) ValidLink(link string) bool {
	parse, err := url.Parse(link)
	if err != nil {
		return false
	}
	if parse.Scheme == "" {
		return false
	}
	if parse.Host == "" {
		return false
	}
	return true
}

var _ Core = (*ShorterService)(nil)
