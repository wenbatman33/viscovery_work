import { NAME } from './constants';

const addPrefix = type => `${NAME}/${type}`;

export const RECEIVE_RESOURCE_CONFIG = addPrefix('RECEIVE_RESOURCE_CONFIG');
