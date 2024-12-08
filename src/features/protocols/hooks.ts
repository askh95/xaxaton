import {
	useGetProtocolQuery,
	useUploadProtocolMutation,
	useDeleteProtocolMutation,
} from "./api";

export const useProtocol = (eventBaseId: number, regionId: number) => {
	const { data: protocol, isLoading } = useGetProtocolQuery({
		eventBaseId,
		regionId,
	});
	const [uploadProtocolMutation] = useUploadProtocolMutation();
	const [deleteProtocol] = useDeleteProtocolMutation();

	const handleUpload = async (file: File) => {
		try {
			await uploadProtocolMutation({
				eventBaseId,
				regionId,
				file,
			}).unwrap();
		} catch (error) {
			console.error("Failed to upload protocol:", error);
			throw error;
		}
	};

	const handleDelete = async () => {
		try {
			await deleteProtocol({ eventBaseId, regionId }).unwrap();
		} catch (error) {
			console.error("Failed to delete protocol:", error);
			throw error;
		}
	};

	return {
		protocol,
		isLoading,
		uploadProtocol: handleUpload,
		deleteProtocol: handleDelete,
	};
};
