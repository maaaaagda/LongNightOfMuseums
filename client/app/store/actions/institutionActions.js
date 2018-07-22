import * as types from './actionsTypes';

export function createInstitution(institution) {
  return {type:  types.CREATE_INSTITUTION, institution}
}


