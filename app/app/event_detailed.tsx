import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  RefreshControl,
  FlatList,
} from "react-native";
import React, { useCallback, useEffect, useState, useContext } from "react";
import {
  deleteEventById,
  fetchAndOpenFile,
  fetchData,
  fetchFileUri,
  removeFileFromEvent,
} from "./api_helper";
import { Link, router, useLocalSearchParams } from "expo-router";
import alert from "./alert";
import { AuthContext } from "./authContext";

// Constants
const IMAGE_EXTENSIONS = ["jpg", "png", "jpeg", "webp"];
const IMAGE_SECTION_TITLE = "Galerija";
const FILE_SECTION_TITLE = "Priložene datoteke";

interface EventDetail {
  title: string;
  content: string;
}

interface FileData {
  id: number;
  uuid: string;
  name: string;
}

interface ImageData {
  uri: string;
  width: number;
  height: number;
}

const EventHeader = ({ title }: { title: string }) => (
  <View style={styles.headerContainer}>
    <Text style={styles.eventTitle}>{title}</Text>
  </View>
);

const DetailSection = ({ title, content }: EventDetail) => (
  <View style={styles.sectionContainer}>
    {title && <Text style={styles.sectionTitle}>{title}</Text>}
    <Text style={styles.sectionContent}>{content}</Text>
  </View>
);

const FileList: React.FC<FileListProps> = ({
  eventId,
  files,
  onFilesUpdated,
}) => {
  const { token } = useContext(AuthContext);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const handleRemove = async (fileId: number) => {
    setLoadingIds((ids) => [...ids, fileId]);
    try {
      await removeFileFromEvent(eventId, fileId);
      onFilesUpdated?.(files.filter((f) => f.id !== fileId));
    } catch (err) {
      console.error("Failed to unlink file:", err);
    } finally {
      setLoadingIds((ids) => ids.filter((id) => id !== fileId));
    }
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{FILE_SECTION_TITLE}</Text>
      {files.map((file) => (
        <View key={file.id} style={styles.fileItem}>
          <TouchableOpacity
            onPress={() => fetchAndOpenFile(file.uuid, file.name)}
            style={{ flex: 1 }}
          >
            <Text style={styles.fileText}>📎 {file.name}</Text>
          </TouchableOpacity>

          {token ? (
            <TouchableOpacity
              onPress={() => handleRemove(file.id)}
              disabled={loadingIds.includes(file.id)}
              style={styles.removeButton}
            >
              {loadingIds.includes(file.id) ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text style={styles.removeIcon}>🗑️</Text>
              )}
            </TouchableOpacity>
          ) : null}
        </View>
      ))}
    </View>
  );
};

const ImageGrid = ({ images }: { images: ImageData[] }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{IMAGE_SECTION_TITLE}</Text>
    <FlatList
      data={images}
      numColumns={2}
      columnWrapperStyle={styles.imageRow}
      renderItem={({ item }) => (
        <Image
          style={[styles.image, { width: item.width, height: item.height }]}
          source={{ uri: item.uri }}
          resizeMode="cover"
        />
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  </View>
);

const ActionButton = ({
  label,
  onPress,
  color = "#007BFF",
  textColor = "#FFFFFF",
}: {
  label: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
}) => (
  <TouchableOpacity
    style={[styles.actionButton, { backgroundColor: color }]}
    onPress={onPress}
  >
    <Text style={[styles.actionButtonText, { color: textColor }]}>{label}</Text>
  </TouchableOpacity>
);

const EventPage = () => {
  const { eventId } = useLocalSearchParams();
  const [eventTitle, setEventTitle] = useState("");
  const [eventDetails, setEventDetails] = useState<EventDetail[]>([]);
  const [files, setFiles] = useState<FileData[]>([]);
  const [images, setImages] = useState<ImageData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = useContext(AuthContext);

  const loadEventData = async () => {
    try {
      const eventData = await fetchData(`/events/${eventId}`);

      setEventTitle(eventData.event.title);

      const details = [
        {
          title: "Opis",
          content: eventData.event.description,
        },
        {
          title: "Podrobnosti",
          content: `📅 Začetek: ${formatDate(
            eventData.event.start
          )}\n👤 Koordinator: ${eventData.event.coordinator}`,
        },
      ];

      setEventDetails(details);

      // Handle files and images
      const filesData = await fetchData(`/events/${eventId}/files`);
      setFiles(filesData.files || []);

      const imageFiles = filesData.files.filter((file) =>
        IMAGE_EXTENSIONS.includes(
          file.name.split(".").pop()?.toLowerCase() || ""
        )
      );

      const imageUris = await Promise.all(
        imageFiles.map(async (file) => ({
          uri: await fetchFileUri(file.uuid),
          width: 160,
          height: 160,
        }))
      );

      setImages(imageUris);
    } catch (error) {
      console.error("Error loading event data:", error);
    }
  };

  // Basic date formatter
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sl-SI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    loadEventData();
  }, [eventId]);

  const handleDelete = () => {
    alert("Brisanje", "Ali ste prepričani, da želite izbrisati dogodek?", [
      {
        text: "Potrdi",
        onPress: async () => {
          await deleteEventById(Number(eventId));
          router.push("/calendar");
        },
      },
      { text: "Prekliči", style: "cancel" },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={loadEventData}
          tintColor="#007BFF"
        />
      }
    >
      <EventHeader title={eventTitle} />
      {eventDetails.map((detail, index) => (
        <DetailSection key={index} {...detail} />
      ))}
      <FileList
        eventId={Number(eventId)}
        files={files}
        onFilesUpdated={setFiles}
      />{" "}
      {images.length > 0 && <ImageGrid images={images} />}
      {token && (
        <View style={styles.buttonGroup}>
          <Link href={`/eventForm?eventId=${eventId}`} asChild>
            <ActionButton label="Uredi dogodek" color="#4CAF50" />
          </Link>
          <ActionButton
            label="Izbriši dogodek"
            onPress={handleDelete}
            color="#FF5252"
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 24,
  },
  headerContainer: {
    marginVertical: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  eventTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: "#1A1A1A",
    textAlign: "center",
    lineHeight: 42,
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
  },
  sectionContainer: {
    marginBottom: 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D2D2D",
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4A4A4A",
  },
  fileItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  fileText: {
    fontSize: 16,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  imageRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  image: {
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
  buttonGroup: {
    gap: 16,
    marginVertical: 32,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
export default EventPage;
