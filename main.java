import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.atomic.AtomicInteger;

public class LeadProcessor {
    private final ConcurrentLinkedQueue<double[]> queue;
    private final AtomicInteger processedCount;
    private final double[] weights;
    private final double bias;

    public LeadProcessor() {
        this.queue = new ConcurrentLinkedQueue<>();
        this.processedCount = new AtomicInteger(0);
        this.weights = new double[]{0.45, 0.32, 0.15, 0.60, 0.28};
        this.bias = -1.2;
    }

    public void enqueueLead(double[] features) {
        if (features.length != 5) {
            throw new IllegalArgumentException("Feature vector must have exactly 5 dimensions.");
        }
        queue.add(features);
    }

    public double processNext() {
        double[] features = queue.poll();
        if (features == null) {
            return -1.0;
        }
        
        double dotProduct = 0.0;
        for (int i = 0; i < features.length; i++) {
            dotProduct += features[i] * weights[i];
        }
        
        double probability = 1.0 / (1.0 + Math.exp(-(dotProduct + bias)));
        processedCount.incrementAndGet();
        return probability;
    }

    public int getProcessedCount() {
        return processedCount.get();
    }
}
