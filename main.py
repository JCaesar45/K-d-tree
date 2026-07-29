from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
from typing import List

app = FastAPI(title="Apex Conversion Engine")

class LeadData(BaseModel):
    features: List[float]
    threshold: float = 0.75

class ConversionResult(BaseModel):
    probability: float
    classification: str

def sigmoid(z: float) -> float:
    return 1 / (1 + np.exp(-z))

def process_lead(features: List[float], weights: List[float], bias: float) -> float:
    z = np.dot(features, weights) + bias
    return sigmoid(z)

@app.post("/api/v1/convert", response_model=ConversionResult)
async def convert_lead(lead: LeadData):
    if len(lead.features) != 5:
        raise HTTPException(status_code=400, detail="Feature vector must contain exactly 5 elements.")
    
    weights = [0.45, 0.32, 0.15, 0.60, 0.28]
    bias = -1.2
    
    probability = process_lead(lead.features, weights, bias)
    classification = "high_intent" if probability >= lead.threshold else "low_intent"
    
    return ConversionResult(probability=probability, classification=classification)
