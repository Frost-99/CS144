import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.*;
import java.nio.charset.*;

public class ComputeSHA {

    private static final byte[] HEX_ARRAY = "0123456789abcdef".getBytes(StandardCharsets.US_ASCII);
    public static String bytesToHex(byte[] bytes) {
        byte[] hexChars = new byte[bytes.length * 2];
        for (int j = 0; j < bytes.length; j++) {
            int v = bytes[j] & 0xFF;
            hexChars[j * 2] = HEX_ARRAY[v >>> 4];
            hexChars[j * 2 + 1] = HEX_ARRAY[v & 0x0F];
        }
        return new String(hexChars, StandardCharsets.UTF_8);
    }
    public static void main(String[] argv) throws Exception {
        if (argv.length != 1) {
            throw new Exception("Check arguments, the program must only take 1 file as input!");
        }

        InputStream is = null;
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        try {
            is = new FileInputStream(argv[0]);
            DigestInputStream dis = new DigestInputStream(is, md);
            dis.on(true);
            while (dis.read() != -1) {
                
            }
            byte[] digest = dis.getMessageDigest().digest();

            String hex = bytesToHex(digest);
            System.out.println(hex);    
        }finally {
            if (is != null) {
                is.close();
            }
        }
        return;
    }
}