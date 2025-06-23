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
  ActivityIndicator
} from "react-native";
import React, { useCallback, useEffect, useState, useContext, useRef } from "react";
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

import Video, {VideoRef} from 'react-native-video';
import { wp, hp } from "./size";

// Constants
const IMAGE_EXTENSIONS = ["jpg", "png", "jpeg", "webp"];
const VIDEO_EXTENSIONS = ["mp4", "webm", "wmv", "ogv", "m4v", "mov"];
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

interface VideoProps {
  uri: string;
  paused: boolean;
  id: number;
}
interface VideoData {
  uri: string;
  title: string;
}

const VideoPlayer = (props: VideoProps) => {
 const videoRef = useRef<VideoRef>(null);

 return (
   <Video 
    // Can be a URL or a local file.
    source={{ uri: props.uri }}
    // Store reference  
    ref={videoRef}
    paused={props.paused}
    // Callback when remote video is buffering                                      
    onBuffer={() => {}}
    // Callback when video cannot be loaded              
    onError={() => {console.error("could not play video");}}               
    style={styles.backgroundVideo}
   />
 )
}

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
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [paused, setPaused] = useState<boolean[]>();
  const [location, setLocation] = useState<string>("");

  const [refreshing, setRefreshing] = useState(false);
  const { token } = useContext(AuthContext);

  const loadEventData = async () => {
    try {
      const eventData = await fetchData(`/events/${eventId}`);

      setEventTitle(eventData.event.title);
      setLocation(eventData.event.location);

      const details = [
        {
          title: "Opis",
          content: eventData.event.description,
        },
        {
          title: "Podrobnosti",
          content: `📅 Začetek: ${formatDate(
            eventData.event.start
          )}\n👤 Koordinator: ${eventData.event.coordinator}\n🗺️ Lokacija: ${eventData.event.location}`,
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

      const videoFiles = filesData.files.filter((file) =>
        VIDEO_EXTENSIONS.includes(
          file.name.split(".").pop()?.toLowerCase() || ""
        )
      );
      const videoUris = await Promise.all(
        videoFiles.map(async (file) => (
          {
            uri: await fetchFileUri(file.uuid),
            title: file.name
          }
        ))
      );

      setVideos(videoUris)
      setPaused(Array(videoUris.length).fill(true));

      console.log("videos: ", videoUris);
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

  const togglePause = (idx: number) => {
  setPaused(prev =>
    prev.map((p, i) => (i === idx ? !p : p))
  );
  }
  const handleDelete = () => {
    alert("Brisanje", "Ali ste prepričani, da želite izbrisati dogodek?", [
      {
        text: "Potrdi",
        onPress: async () => {
          await deleteEventById(Number(eventId));
          router.push("/calendar");
        },
      },
      { text: "Prekliči", style: "cancel", onPress: () => {} },
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
      />
      {images.length > 0 && <ImageGrid images={images} />}
       {videos && videos.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Videji</Text>
          {videos.map((video, i) => (
            <View key={i} style={styles.videoWrapper}>
              <Text style={styles.sectionSubTitle}>
                {video.title.substring(0, video.title.lastIndexOf('.'))}
              </Text>
            <TouchableOpacity onPress={() => {togglePause(i);}}>
            <VideoPlayer uri={video.uri} paused={paused[i]} id={i}/>
            </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      {location === "Večnamenska dvorana 1" && 
      <Image source={require("./images/vecnamenskaDvorana1.gif")} style={styles.location} />
      }
      {location === "Večnamenska dvorana 2" &&
      <Image source={require("./images/vecnamenskaDvorana2.gif")} style={styles.location} />
      }
      
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
  sectionSubTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 9,
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
  backgroundVideo: {
   position: "relative",
   width: 800,
   height: "auto",
  },
  videoWrapper: {
    marginBottom: 20,
    alignItems: "flex-start"
  },
  location: {
    height: hp(60), 
    alignSelf: "center", 
    marginBottom: 20,
    width: wp(100) > 600 ? wp(35) : wp(100),
  }
});
export default EventPage;
