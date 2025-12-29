from enum import Enum
from pydantic import BaseModel, Field
from typing import List, Optional, Annotated

class Complaint(BaseModel):
    category: str
    description: str
    severity: int  


class AgentFailure(BaseModel):
    description: str  
    utterance: str
    timestamp: str 


class AgentSuccess(BaseModel):
    description: str  
    utterance: str
    timestamp: str

class ChurnRisk(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    
class EmotionPoint(BaseModel):
    timestamp: str
    emotion: str  


class HandlingMetrics(BaseModel):
    total_speaking_ratio_agent: float
    interruptions_count: Annotated[int, Field(ge=0)]
    silence_risk: bool
    responsiveness_score: Annotated[int, Field(ge=0, le=5)]  

class CallInsights(BaseModel):
    customer_complaints: List[Complaint]
    agent_failures: List[AgentFailure]
    agent_successes: List[AgentSuccess]
    customer_complaint_summary: str
    root_cause: Optional[str]        
    was_issue_resolved: bool
    resolution_confidence: float  
    customer_emotion_timeline: List[EmotionPoint]
    overall_experience: str 
    churn_risk: ChurnRisk  
    predicted_csat: Annotated[int, Field(ge=1, le=5)]
    escalation_needed: bool
    policy_or_process_gap: Optional[str]
    nps_prediction: Annotated[int, Field(ge=0, le=10)] 
    quality_score_agent: Annotated[int, Field(ge=0, le=100)]
    handling_metrics: HandlingMetrics

