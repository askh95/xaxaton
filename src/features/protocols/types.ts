export interface ProtocolParams {
	eventBaseId: number;
	regionId: number;
}

export interface UploadProtocolParams extends ProtocolParams {
	file: File;
}
