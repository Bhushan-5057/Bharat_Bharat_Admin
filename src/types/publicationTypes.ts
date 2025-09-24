export interface Creator {
  id: number;
  name: string;
}

export interface SelectedPublication {
  id: number;
  file_name: string;
  created_by: number;
  createdAt: string;
  creator: Creator;
}

export interface Publication {
    id: number;
    file_name: string;
    created_by: number;
    createdAt: string;
    creator: {
        id: number;
        name: string;
    };

}

export interface PublicationState {
    publications: Publication[];
    selectedPublication: Publication | null;
    loading: boolean;
    error: string | null;
    fileName?: string;
}