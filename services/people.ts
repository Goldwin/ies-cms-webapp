'use client'
import { getToken } from "@/lib/commands/auth/login";
import { Person } from "@/entities/people/person";
import axios from "axios";
import { camelCase, snakeCase } from 'lodash';

const API_URL = process.env.PEOPLE_URL ?? "";

const camelizeKeys:any = (obj:any) => {
  if (Array.isArray(obj)) {
    return obj.map(v => camelizeKeys(v));
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: camelizeKeys(obj[key]),
      }),
      {},
    );
  }
  return obj;
};

const snakeCaseKeys:any = (obj:any) => {
  if (Array.isArray(obj)) {
    return obj.map(v => snakeCaseKeys(v));
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [snakeCase(key)]: snakeCaseKeys(obj[key]),
      }),
      {},
    );
  }
  return obj;
};

interface SearchQuery {
  limit: number  
  lastID: string
  namePrefix?: string
}

class PeopleService {
  async search(searchQuery: SearchQuery, output: Output<Person[]>) {        
      const url = API_URL + "/search"
      const token = getToken()
      return axios.post(url, {
          limit: searchQuery.limit,
          last_id: searchQuery.lastID,
          name_prefix: searchQuery.namePrefix??""
      }, {headers: {"Authorization": `Bearer ${token}`}}).then(response => {
          let persons:Person[]
          persons = []
          response.data.data.forEach((person: any) => {
              persons.push(new Person(JSON.stringify(person)))
          })
          output.onSuccess(persons)
      }).catch(error => {
          output.onError(error)
      });
  }

  async add(person: Person, output: Output<Person>) {
      const url = API_URL + "/person"
      const token = getToken()
      
      const payload = snakeCaseKeys(person)    

      return axios.post(url, payload, {headers: {"Authorization": `Bearer ${token}`}}).then(response => {
          const result:Person = new Person(JSON.stringify(response.data.data))
          output.onSuccess(result)
      }).catch(error => {
          output.onError(error)
      });
  }

  async get(personId: string, output: Output<Person>) {
    const url = API_URL + "/person/"+personId
    const token = getToken()          

    return axios.get(url, {headers: {"Authorization": `Bearer ${token}`}}).then(response => {
      const result:Person = new Person(JSON.stringify(response.data.data))
        output.onSuccess(result)
    }).catch(error => {
        output.onError(error)
    });
  }

  async update(personId: string, person: Person, output: Output<Person>) {
    const url = API_URL + "/person/"+personId
    const token = getToken()
    const payload = snakeCaseKeys(person)
    return axios.put(url, payload, {headers: {"Authorization": `Bearer ${token}`}}).then(response => {
      const result:Person = new Person(JSON.stringify(response.data.data))
        output.onSuccess(result)
    }).catch(error => {
        output.onError(error)
    });
  }
}

const peopleService = new PeopleService();
export default peopleService