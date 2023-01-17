package model

import "go.etcd.io/bbolt"

type ShorterDB struct {
	db     *bbolt.DB
	bucket string
}

func (s ShorterDB) Close() {
	err := s.db.Close()
	if err != nil {
		return
	}
}

type ShorterCore interface {
	Get(key string) (string, error)
	Set(key string, value string) error
	Del(key string) error
	GetByValue(value string) (string, error)
	Flush() error
	All() (map[string]string, error)
	Total() (int, error)
	Close()
}

func InitDb(dbName string, bucketName string) *ShorterDB {
	db := openDB(dbName)
	err := InitBucket(db, bucketName)
	if err != nil {
		panic(err)
	}
	return &ShorterDB{db, bucketName}
}

func openDB(dbName string) *bbolt.DB {
	db, err := bbolt.Open(dbName, 0600, nil)
	if err != nil {
		panic(err)
	}
	return db
}

func InitBucket(db *bbolt.DB, bucketName string) error {
	return db.Update(func(tx *bbolt.Tx) error {
		_, err := tx.CreateBucketIfNotExists([]byte(bucketName))
		return err
	})
}

var _ ShorterCore = (*ShorterDB)(nil)

func (s ShorterDB) Get(key string) (string, error) {
	var value string
	err := s.db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(s.bucket))
		value = string(b.Get([]byte(key)))
		return nil
	})
	return value, err

}

func (s ShorterDB) Set(key string, value string) error {
	return s.db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(s.bucket))
		return b.Put([]byte(key), []byte(value))
	})

}

func (s ShorterDB) Del(key string) error {
	return s.db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(s.bucket))
		return b.Delete([]byte(key))
	})
}

func (s ShorterDB) GetByValue(value string) (string, error) {
	var key string
	err := s.db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(s.bucket))
		c := b.Cursor()
		for k, v := c.First(); k != nil; k, v = c.Next() {
			if string(v) == value {
				key = string(k)
				return nil
			}
		}
		return nil
	})
	return key, err
}

func (s ShorterDB) Flush() error {
	//del And New
	err := s.db.Update(func(tx *bbolt.Tx) error {
		err := tx.DeleteBucket([]byte(s.bucket))
		if err != nil {
			return err
		}
		_, err = tx.CreateBucket([]byte(s.bucket))
		if err != nil {
			return err
		}
		return nil
	})
	return err

}

func (s ShorterDB) All() (map[string]string, error) {
	var result = make(map[string]string)
	err := s.db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(s.bucket))
		c := b.Cursor()
		for k, v := c.First(); k != nil; k, v = c.Next() {
			result[string(k)] = string(v)
		}
		return nil
	})
	return result, err
}

func (s ShorterDB) Total() (int, error) {
	var count int
	err := s.db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(s.bucket))
		c := b.Cursor()
		for k, _ := c.First(); k != nil; k, _ = c.Next() {
			count++
		}
		return nil
	})
	return count, err
}
